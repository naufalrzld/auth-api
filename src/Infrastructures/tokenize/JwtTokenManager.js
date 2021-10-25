const TokenManager = require('../../Applications/tokenize/TokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends TokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async generateAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  async generateRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const artifacts = this._jwt.decode(refreshToken);
      this._jwt.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload
    } catch (err) {
      throw new InvariantError('refresh token tidak valid');
    }
  }
}

module.exports = JwtTokenManager;