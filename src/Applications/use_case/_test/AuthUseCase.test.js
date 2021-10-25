const AuthRepository = require('../../../Domains/authentications/AuthRepository');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const TokenManager = require('../../tokenize/TokenManager');
const AuthUseCase = require('../AuthUseCase');

describe('AuthUseCase', () => {
  it('should orchestrating the user authentication action correctly', async () => {
    const useCasePayload = {
      id: 'user-123',
      username: 'dicoding',
    };

    const expectedToken = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    const mockTokenManager = new TokenManager();
    const mockAuthRepository = new AuthRepository();

    mockTokenManager.generateAccessToken = jest.fn().mockImplementation(() => 'access_token');
    mockTokenManager.generateRefreshToken = jest.fn().mockImplementation(() => 'refresh_token');
    mockAuthRepository.saveRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());

    const authUseCase = new AuthUseCase({
      tokenManager: mockTokenManager,
      authRepository: mockAuthRepository,
    });

    const token = await authUseCase.generateUserToken(useCasePayload);

    expect(token).toStrictEqual(expectedToken);
    expect(mockTokenManager.generateAccessToken).toBeCalledWith(useCasePayload);
    expect(mockTokenManager.generateRefreshToken).toBeCalledWith(useCasePayload);
    expect(mockAuthRepository.saveRefreshToken).toBeCalledWith(expectedToken.refreshToken);
  });

  it('should orchestrating the refresh token action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refresh_token'
    };

    const expectedUserCredential = {
      id: 'user-123',
      username: 'dicoding',
    };

    const mockTokenManager = new TokenManager();
    const mockAuthRepository = new AuthRepository();

    mockAuthRepository.findToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => expectedUserCredential);
    mockTokenManager.generateAccessToken = jest.fn().mockImplementation(() => 'new_access_token');

    const authUseCase = new AuthUseCase({
      authRepository: mockAuthRepository,
      tokenManager: mockTokenManager,
    });

    const newAccessToken = await authUseCase.verifyRefreshToken(useCasePayload);

    expect(newAccessToken).toEqual('new_access_token');
    expect(mockAuthRepository.findToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.generateAccessToken).toBeCalledWith(expectedUserCredential);
  });

  it('should orchestrating the delete refresh token action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refresh_token'
    };

    const mockTokenManager = new TokenManager();
    const mockAuthRepository = new AuthRepository();

    mockAuthRepository.findToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthRepository.deleteRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());

    const authUseCase = new AuthUseCase({
      authRepository: mockAuthRepository,
      tokenManager: mockTokenManager,
    });

    await expect(authUseCase.deleteRefreshToken(useCasePayload)).resolves.not.toThrowError(InvariantError);
    expect(mockAuthRepository.findToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthRepository.deleteRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
  });
});