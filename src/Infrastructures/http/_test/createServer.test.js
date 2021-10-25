const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP server', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({});

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    expect(response.statusCode).toEqual(404);
  });

  describe('when GET /', () => {
    it('should return 200 and hello world', async () => {
      // Arrange
      const server = await createServer({});
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Hello world!');
    });
  });

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        fullname: 'Dicoding Indonesia',
        password: 'secret',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: ['Dicoding Indonesia'],
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
    });

    it('should response 400 when username more than 50 character', async () => {
      const requestPayload = {
        username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
    });

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding indonesia',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
    });

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const requestPayload = {
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        password: 'super_secret',
      };
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak tersedia');
    });
  });

  describe('when POST /authentications', () => {
    it('should response 201', async () => {
      const server = await createServer(container);

      const requestCreateUser = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestCreateUser,
      });

      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });

    it('should response 400 when user not found', async () => {
      const server = await createServer(container);

      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).toEqual('username tidak ditemukan');
    });
  });

  describe('when PUT /authentications', () => {
    it('should response 400 when given invalid token', async () => {
      const server = await createServer(container);

      const payload = {
        refreshToken: 'refresh_token',
      };

      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 200 when given valid token', async () => {
      const server = await createServer(container);

      const requestCreateUser = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestCreateUser,
      });

      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const requestRefreshTokenPayload = {
        refreshToken: responseAuthJson.data.refreshToken,
      };

      const responseRefreshToken = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestRefreshTokenPayload,
      });

      const responseRefreshTokenJson = JSON.parse(responseRefreshToken.payload);
      expect(responseRefreshToken.statusCode).toEqual(200);
      expect(responseRefreshTokenJson.status).toEqual('success');
      expect(responseRefreshTokenJson.data.accessToken).toBeDefined();
    });
  });

  describe('when DELETE /authentications', () => {
    it('should response 400 when given invalid token', async () => {
      const server = await createServer(container);

      const payload = {
        refreshToken: 'refresh_token',
      };

      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 200 when given valid token', async () => {
      const server = await createServer(container);

      const requestCreateUser = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestCreateUser,
      });

      const requestAuthPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestAuthPayload,
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const requestRefreshTokenPayload = {
        refreshToken: responseAuthJson.data.refreshToken,
      };

      const responseDeleteRefreshToken = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestRefreshTokenPayload,
      });

      const responseDeleteRefreshTokenJson = JSON.parse(responseDeleteRefreshToken.payload);
      expect(responseDeleteRefreshToken.statusCode).toEqual(200);
      expect(responseDeleteRefreshTokenJson.status).toEqual('success');
      expect(responseDeleteRefreshTokenJson.message).toBeDefined();
      expect(responseDeleteRefreshTokenJson.message).toEqual('refresh token berhasil dihapus');
    });
  });

  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const server = await createServer({}); // fake container

    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(500);
    expect(responseJson.status).toEqual('error');
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami');
  });
});