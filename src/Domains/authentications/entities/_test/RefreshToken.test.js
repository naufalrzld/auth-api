const RefreshToken = require('../RefreshToken');

describe('a RefreshToken entities', () => {
  it('should throw error when not given required property', () => {
    expect(() => new RefreshToken({})).toThrowError('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      refreshToken: 123,
    };

    expect(() => new RefreshToken(payload)).toThrowError('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create refreshToken object correctly', () => {
    const payload = {
      refreshToken: 'refresh_token',
    };

    const refreshToken = new RefreshToken(payload);

    expect(refreshToken.refreshToken).toEqual(payload.refreshToken);
  });
});