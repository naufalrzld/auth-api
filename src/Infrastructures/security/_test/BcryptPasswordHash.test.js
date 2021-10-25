const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10);
    });
  });

  describe('compare function', () => {
    it('should throw AuthenticationError when password not match', async () => {
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      await expect(bcryptPasswordHash.compare('plain_password', 'encrypted_password')).rejects.toThrowError(AuthenticationError);
      expect(spyCompare).toBeCalledWith('plain_password', 'encrypted_password');
    });

    it('should not throw AuthenticationError when password match', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const spyCompare = jest.spyOn(bcrypt, 'compare');

      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      await expect(bcryptPasswordHash.compare('plain_password', encryptedPassword)).resolves.not.toThrowError(AuthenticationError);
      expect(spyHash).toBeCalledWith('plain_password', 10);
      expect(spyCompare).toBeCalledWith('plain_password', encryptedPassword);
    })
  });
});