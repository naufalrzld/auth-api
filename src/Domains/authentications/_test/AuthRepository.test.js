const AuthRepository = require('../AuthRepository');

describe('AuthRepository interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    const authRepository = new AuthRepository();

    expect(authRepository.saveRefreshToken('refresh_token')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepository.findToken('refresh_token')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepository.deleteRefreshToken('refresh_token')).rejects.toThrowError('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});