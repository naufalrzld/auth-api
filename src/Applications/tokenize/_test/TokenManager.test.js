const TokenManager = require('../TokenManager');

describe('TokenManager interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    const tokenManager = new TokenManager();

    expect(tokenManager.generateAccessToken({})).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(tokenManager.generateRefreshToken({})).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(tokenManager.verifyRefreshToken('refresh_token')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});