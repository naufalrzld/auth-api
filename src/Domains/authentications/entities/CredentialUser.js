class CredentialUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, password } = payload;

    this.id = id;
    this.password = password;
  }

  _verifyPayload({ id, password }) {
    if (!id || !password) {
      throw new Error('CREDENTIAL_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof password !== 'string') {
      throw new Error('CREDENTIAL_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CredentialUser;