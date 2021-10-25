const RefreshToken = require('../../Domains/authentications/entities/RefreshToken');

class AuthUseCase {
  constructor({ authRepository, tokenManager }) {
    this._authRepository = authRepository;
    this._tokenManager = tokenManager;
  }

  async generateUserToken(payload) {
    const token = {
      accessToken: await this._tokenManager.generateAccessToken(payload),
      refreshToken: await this._tokenManager.generateRefreshToken(payload),
    }

    await this._authRepository.saveRefreshToken(token.refreshToken);

    return token;
  }

  async verifyRefreshToken(payload) {
    const { refreshToken } = new RefreshToken(payload)
    await this._authRepository.findToken(refreshToken);
    const { id, username } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.generateAccessToken({ id, username });

    return accessToken;
  }

  async deleteRefreshToken(payload) {
    const { refreshToken } = new RefreshToken(payload);
    await this._authRepository.findToken(refreshToken)
    this._tokenManager.verifyRefreshToken(refreshToken);
    await this._authRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = AuthUseCase;