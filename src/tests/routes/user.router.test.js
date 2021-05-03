/* eslint-disable */
const randomString = require('randomstring');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../../app');
const { ENTITY_EXISTS, AUTHENTICATION_ERROR } = require('../../errors/appError');
const UserModel = require('../../users/user.model');
const UserService = require('../../users/index');

const {
  CREATED, BAD_REQUEST, EXPECTATION_FAILED, OK, FORBIDDEN, UNAUTHORIZED,
} = StatusCodes;

describe('User Router:', () => {
  let server;
  let user;

  const userMockData = {
    email: 'email@email.ru',
    login: 'login',
    password: 'password',
  };

  beforeAll(async () => {
    server = app.listen(3001);
    userMockData.userSecret = randomString.generate(7);
    user = new UserModel(userMockData);
  });

  afterAll(async () => {
    await server.close();
  });

  describe('/users/register', () => {
    beforeAll(() => {
      jest.restoreAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('can register users', async () => {
      UserService.register = jest.fn().mockImplementation(() => Promise.resolve(userMockData));

      await request(server).post('/users/register').send({
        email: 'mail@mail.eu',
        login: 'Test Login',
        password: 'testpassword',
      }).set('Accept', 'application/json')
        .expect(CREATED);
    });

    it('send BAD_REQUEST if validation error', async () => {
      await request(server).post('/users/register').send({

        login: 'Test Login',
        password: 'testpassword',
      }).set('Accept', 'application/json')
        .expect(BAD_REQUEST);
    });

    it('send EXPECTATIONS_FAILED if user already exists', async () => {
      jest
        .spyOn(UserService, 'register')
        .mockImplementation(() => Promise.reject(new ENTITY_EXISTS('User already exists')));
      await request(server).post('/users/register').send({
        email: 'test@test.ru',
        login: 'Test Login',
        password: 'testpassword',
      }).set('Accept', 'application/json')
        .expect(EXPECTATION_FAILED);
    });
  });

  describe('/users/login', () => {
    const userMock = {
      login: 'dev@dev.ru',
      password: 'password',
    };

    beforeAll(() => {
      jest.restoreAllMocks();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('receives OK Status Code', async () => {
      jest.spyOn(UserService, 'login').mockImplementation(() => ({
        token: '34578',
        userId: '6gjdsk45456dn',
      }));

      await request(server)
        .post('/users/login')
        .send(userMock)
        .set('Accept', 'application/json')
        .expect(CREATED);
    });

    it('send FORBIDDEN Status if authentication failed', async () => {
      jest.spyOn(UserService, 'login').mockImplementation(() => Promise.reject(
        new AUTHENTICATION_ERROR('Wrong login or password'),
      ));
      await request(server)
        .post('/users/login')
        .send(userMock)
        .set('Accept', 'application/json')
        .expect(FORBIDDEN);
    });
  });
});
