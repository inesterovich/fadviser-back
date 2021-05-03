/* eslint-disable */
const request = require('supertest');
const AuthMiddleware = require('../../middleware/auth.middleware');
const UserService = require('../../users/index');


const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;



describe('UserSecureRouter', () => {
  let app;
  let server;
  let user;
  const userId = '6078800db457a8b8f76c5302'

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
    jest.restoreAllMocks();
    server && server.close();
  });

  it('GET /users/:userId sends json', async () => {

    jest.spyOn(UserService, 'getById').mockResolvedValueOnce({
      userId
    })

    await request(server)
      .get(`/users/${userId}`)
      .expect(OK).expect('Content-Type', /json/);
   
  })

  it('PUT /users/:userId sends json', async () => {

    jest.spyOn(UserService, 'update').mockResolvedValueOnce({
      userId
    });
    await request(server)
      .put(`/users/${userId}`).send({
        _id: userId,
        name: 'Test Name'
    }).set('Accept', 'application/json')
    .expect(OK).expect('Content-Type', /json/);

  })

  it('DELETE /users/:userId sends NO_CONTENT status', async () => {
    jest.spyOn(UserService, 'remove').mockResolvedValueOnce({
    });
    await request(server)
      .delete(`/users/${userId}`)
      .expect(NO_CONTENT);
  })



})