const request = require('supertest');
const AuthMiddleware = require('../middleware/auth.middleware');
const OperationService = require('../modules/accounting/operations/index');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;

describe ('OperationSecureRouter', () => {

  let app;
  let server;
  let user;
  const userId = '6078800db457a8b8f76c5302';
  const accountId = '6078800db457a8b8f76c5302';
  const operationId = '6078800db457a8b8f76c5302';

  const userMockData = {
    email: 'email@email.ru',
    login: 'login',
    password: 'password',
  }

  let spyedCheckToken;
  let spyedDecodeToken;
  let spyedUserIdValidator;
  let spyedValidateToken;


  beforeAll( () => {

  spyedCheckToken = jest.spyOn(AuthMiddleware, 'checkToken').mockImplementation((req, res, next) => next());
  spyedDecodeToken = jest.spyOn(AuthMiddleware, 'decodeToken').mockImplementation((req, res, next) => next());
   spyedUserIdValidator = jest.spyOn(AuthMiddleware, 'userIdValidator').mockImplementation((req, res, next) => next());
   spyedValidateToken = jest.spyOn(AuthMiddleware, 'validateToken').mockImplementation((req, res, next) => next());
   
   app = require('../../app');

   server = app.listen(3001);
 })
 
 afterAll(() => {
   server && server.close();
 });

  it('POST /users/:userId/accounts/:accountId/add sends json', async () => {

    jest.spyOn(OperationService, 'add').mockResolvedValueOnce({});

    await request(server)
      .post(`/users/${userId}/accounts/${accountId}/add`)
      .send({
        date: new Date(),
        category: 'Permament Income',
        operationType: 'Income',
        sum: 0
      })
      .set('Content-Type', 'application/json')
      .expect(OK).expect('Content-Type', /json/);

  })

  it('POST /users/:userId/accounts/:accountId/:operationId/update sends json', async () => {
    jest.spyOn(OperationService, 'update').mockResolvedValueOnce({});
    await request(server)
    .post(`/users/${userId}/accounts/${accountId}/${operationId}/update`)
      .send({
      _id: operationId,
      date: new Date(),
      category: 'Permament Income',
      operationType: 'Income',
      sum: 0
    })
    .set('Content-Type', 'application/json')
    .expect(OK).expect('Content-Type', /json/);
  })

  it('GET /users/:userId/accounts/:accountId/:operationId/delete sends json', async () => {
    jest.spyOn(OperationService, 'remove').mockResolvedValueOnce({})

    await request(server)
    .get(`/users/${userId}/accounts/${accountId}/${operationId}/delete`)
    .expect(OK).expect('Content-Type', /json/);
  })

})