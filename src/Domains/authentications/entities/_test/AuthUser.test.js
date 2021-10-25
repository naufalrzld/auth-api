const AuthUser = require('../AuthUser');

describe('a AuthUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      password: 'abc',
    };

    expect(() => new AuthUser(payload)).toThrowError('AUTH_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      password: 'abc',
    };

    expect(() => new AuthUser(payload)).toThrowError('AUTH_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains more than 50 character', () => {
    const payload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      password: 'abc',
    };

    expect(() => new AuthUser(payload)).toThrowError('AUTH_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contains restricted character', () => {
    const payload = {
      username: 'dico ding',
      password: 'abc',
    };

    expect(() => new AuthUser(payload)).toThrowError('AUTH_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create registerUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      password: 'abc',
    };

    const { username, password } = new AuthUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
})