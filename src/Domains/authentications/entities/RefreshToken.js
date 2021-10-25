class RefreshToken {
  constructor(payload) {
    this._verifyPayload(payload);

    const { refreshToken } = payload;

    this.refreshToken = refreshToken;
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshToken;