const RegisterUser = require('../../Domains/users/entities/RegisterUser');
const AuthUser = require('../../Domains/authentications/entities/AuthUser');

class UserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async addUser(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    return this._userRepository.addUser(registerUser);
  }

  async verifyUserCredential(useCasePayload) {
    const authUser = new AuthUser(useCasePayload);
    const userCredential = await this._userRepository.getUserCredential(authUser.username);
    await this._passwordHash.compare(authUser.password, userCredential.password);
    return userCredential.id;
  }
}

module.exports = UserUseCase;