/* eslint-disable */

const request = require('supertest');
const AuthMiddleware = require('../../middleware/auth.middleware');
const AccountService = require('../../modules/accounting/accounts/index');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT, CREATED } = StatusCodes;
describe('AccountSecureRouter', () => {
  let app;
  let server;
  let user;
  const userId = '6078800db457a8b8f76c5302';
  const accountId = '6078800db457a8b8f76c5302';

  const userMockData = {
    email: 'email@email.ru',
    login: 'login',
    password: 'password',
  }

  let spyedCheckToken;
  let spyedDecodeToken;
  let spyedUserIdValidator;
  let spyedValidateToken;


  beforeAll(() => {
    spyedCheckToken = jest.spyOn(AuthMiddleware, 'checkToken').mockImplementation((req, res, next) => next());
   spyedDecodeToken = jest.spyOn(AuthMiddleware, 'decodeToken').mockImplementation((req, res, next) => next());
    spyedUserIdValidator = jest.spyOn(AuthMiddleware, 'userIdValidator').mockImplementation((req, res, next) => next());
    spyedValidateToken = jest.spyOn(AuthMiddleware, 'validateToken').mockImplementation((req, res, next) => next());
    
    app = require('../../../app');

    server = app.listen(3001);
  })
  
  afterAll(() => {
    server && server.close();
  });
  
  it('GET /users/:userId/accounts/ sends json', async () => {
    jest.spyOn(AccountService, 'getAll').mockResolvedValueOnce([]);

    await request(server)
      .get(`/users/${userId}/accounts`)
      .expect(OK)
      .expect('Content-Type', /json/)

  })

  it('POST /users/:userId/accounts sends json', async () => {
    jest.spyOn(AccountService, 'create').mockResolvedValueOnce({});

    await request(server)
      .post(`/users/${userId}/accounts`)
      .send({
        name: 'Test account Name',
        accountType: 'Bank account'
      })
      .set('Content-Type', 'application/json')
      .expect(CREATED)
      .expect('Content-Type', /json/);
  })

  it('GET /users/:userId/accounts/:accountId sends json', async () => {
    jest.spyOn(AccountService, 'get').mockResolvedValueOnce({});
    await request(server)
      .get(`/users/${userId}/accounts/${accountId}`)
      .expect(OK)
      .expect('Content-Type', /json/);

  })

  it('DELETE /users/:userId/accounts/:accountId sends json', async () => {
    jest.spyOn(AccountService, 'remove').mockResolvedValueOnce({});
    await request(server)
      .delete(`/users/${userId}/accounts/${accountId}`)
      .expect(NO_CONTENT)
    
  })
})