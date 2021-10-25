const CredentialUser = require('../CredentialUser');

describe('a CredentialUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      password: 'encrypted_password',
    };

    expect(() => new CredentialUser(payload)).toThrowError('CREDENTIAL_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      password: 'encrypted_password',
    };

    expect(() => new CredentialUser(payload)).toThrowError('CREDENTIAL_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create credentialUser object correctly', () => {
    const payload = {
      id: 'user-123',
      password: 'encrypted_password',
    };

    const credentialUser = new CredentialUser(payload);

    expect(credentialUser.id).toEqual(payload.id);
    expect(credentialUser.password).toEqual(payload.password);
  });
})