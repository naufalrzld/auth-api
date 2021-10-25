const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('generateAccessToken function', () => {
    it('should generate access token correctly', async () => {
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };

      const mockJwt = {
        generate: jest.fn().mockImplementation(() => 'mock_jwt'),
      }

      const jwtTokenManager = new JwtTokenManager(mockJwt);

      const token = await jwtTokenManager.generateAccessToken(payload);

      expect(mockJwt.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
      expect(token).toEqual('mock_jwt');
    });
  });
  
  describe('generateRefreshToken function', () => {
    it('should generate refresh token correctly', async () => {
      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };

      const mockJwt = {
        generate: jest.fn().mockImplementation(() => 'mock_jwt'),
      }

      const jwtTokenManager = new JwtTokenManager(mockJwt);

      const token = await jwtTokenManager.generateRefreshToken(payload);

      expect(mockJwt.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(token).toEqual('mock_jwt');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should verify refresh token correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      const spyGenerateRefreshToken = jest.spyOn(jwtTokenManager, 'generateRefreshToken');
      const spyVerifyRefreshToken = jest.spyOn(jwtTokenManager, 'verifyRefreshToken');

      const payload = {
        id: 'user-123',
        username: 'dicoding',
      };

      const refreshToken = await jwtTokenManager.generateRefreshToken(payload);
      const credential = await jwtTokenManager.verifyRefreshToken(refreshToken);

      const credentialPayload = {
        id: credential.id,
        username: credential.username,
      };

      expect(credentialPayload).toStrictEqual(payload);
      expect(spyGenerateRefreshToken).toBeCalledWith(payload);
      expect(spyVerifyRefreshToken).toBeCalledWith(refreshToken);
    });

    it('should throw InvariantError when given invalid refresh token', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      await expect(jwtTokenManager.verifyRefreshToken('refreshToken')).rejects.toThrowError(InvariantError);
    });
  });
});