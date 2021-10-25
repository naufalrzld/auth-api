const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const CredentialUser = require('../../../Domains/authentications/entities/CredentialUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const UserUseCase = require('../UserUseCase');

describe('UserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn().mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn().mockImplementation(() => Promise.resolve(expectedRegisteredUser));

    const getUserUseCase = new UserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const registeredUser = await getUserUseCase.addUser(useCasePayload);

    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username);
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password);
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
    }));
  });

  it('should orchestrating the verify user credential action correctly', async () => {
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const expectedCredentialUser = new CredentialUser({
      id: 'user-123',
      password: 'ecrypted_password',
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.getUserCredential = jest.fn().mockImplementation(() => Promise.resolve(expectedCredentialUser));
    mockPasswordHash.compare = jest.fn().mockImplementation(() => Promise.resolve());

    const getUserUseCase = new UserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    const verifyUserCredential = await getUserUseCase.verifyUserCredential(useCasePayload);

    expect(verifyUserCredential).toStrictEqual(expectedCredentialUser.id);
    expect(mockPasswordHash.compare).toBeCalledWith(useCasePayload.password, expectedCredentialUser.password);
    expect(mockUserRepository.getUserCredential).toBeCalledWith(useCasePayload.username);
  });
});