class AuthRepository {
  async saveRefreshToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async findToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteRefreshToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthRepository;