const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');

describe('AuthRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('saveRefreshToken function', () => {
    it('should token has been added to database', async () => {
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      await authRepositoryPostgres.saveRefreshToken('token');

      const token = await AuthenticationsTableTestHelper.findToken('token');

      expect(token).toHaveLength(1);
    });
  });

  describe('findToken function', () => {
    it('should throw InvariantError when given invalid token', async () => {
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      await expect(authRepositoryPostgres.findToken('refresh_token')).rejects.toThrowError(InvariantError);
    });

    it('should not throw InvariantError when given valid token', async () => {
      await AuthenticationsTableTestHelper.addToken('refresh_token');
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      await expect(authRepositoryPostgres.findToken('refresh_token')).resolves.not.toThrowError(InvariantError);
    });
  });

  describe('deleteRefreshToken function', () => {
    it('should delete token successful', async () => {
      await AuthenticationsTableTestHelper.addToken('refresh_token');
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      await expect(authRepositoryPostgres.deleteRefreshToken('refresh_token')).resolves.not.toThrowError(InvariantError);
      await expect(authRepositoryPostgres.findToken('refresh_token')).rejects.toThrowError(InvariantError);
    });
  });
});