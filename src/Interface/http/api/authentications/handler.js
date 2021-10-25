const AuthUseCase = require('../../../../Applications/use_case/AuthUseCase');
const UserUseCase = require('../../../../Applications/use_case/UserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthentication = this.postAuthentication.bind(this);
    this.putAuthentication = this.putAuthentication.bind(this);
    this.deleteAuthentication = this.deleteAuthentication.bind(this);
  }

  async postAuthentication(request, h) {
    const userUseCase = this._container.getInstance(UserUseCase.name);
    const authUseCase = this._container.getInstance(AuthUseCase.name);

    const userId = await userUseCase.verifyUserCredential(request.payload);

    const requestTokenPayload = {
      id: userId,
      username: request.payload.username,
    };

    const token = await authUseCase.generateUserToken(requestTokenPayload);

    const response = h.response({
      status: 'success',
      data: token,
    });

    response.code(201);
    return response;
  }

  async putAuthentication(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);

    const accessToken = await authUseCase.verifyRefreshToken(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });

    response.code(200);
    return response;
  }

  async deleteAuthentication(request) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    await authUseCase.deleteRefreshToken(request.payload);

    return {
      status: 'success',
      message: 'refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;