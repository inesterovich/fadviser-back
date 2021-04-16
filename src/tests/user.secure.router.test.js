const request = require('supertest');
const AuthMiddleware = require('../middleware/auth.middleware');
const UserService = require('../users/index');


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
    
    app = require('../../app');

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

  it('POST /users/:userId/update sends json', async () => {

    jest.spyOn(UserService, 'update').mockResolvedValueOnce({
      userId
    });
    await request(server)
      .post(`/users/${userId}/update`).send({
        _id: userId,
        name: 'Test Name'
    }).set('Accept', 'application/json')
    .expect(OK).expect('Content-Type', /json/);

  })

  it('GET /users/:userId/delete sends NO_CONTENT status', async () => {
    jest.spyOn(UserService, 'remove').mockResolvedValueOnce({
    });
    await request(server)
      .get(`/users/${userId}/delete`)
      .expect(NO_CONTENT);
  })



})

/*
describe('UserSecureRouter', () => {

  let server;
  let user;

  const userMockData = {
    email: 'email@email.ru',
    login: 'login',
    password: 'password',
  }

  beforeAll( async() => {
    await UserModel.deleteMany();
    server = app.listen(3001);
  })

  afterAll(async () => {
    await UserModel.deleteMany();
    await mongoose.connection.close();

    server && server.close();
  })



  describe('/users/:userId', () => {
    let authData;

    beforeAll( async () => {
      user = await UserService.register(userMockData);
      authData = await UserService.login(userMockData.login, userMockData.password);
    });

    afterAll( async () => {
      await UserModel.deleteMany();
    })

    it('should send UNAUTHORIZED status  if token not send', async () => {
      const userId = user._id;

      await request(server).post(`/users/${userId}`).expect(UNAUTHORIZED)
    })
    
    it('should OK if success', async () => {
      await request(server)
        .get(`/users/${user._id}`)
        .send({
          login: userMockData.login,
          password: userMockData.password
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authData.token}`).expect(OK);
          
      }) 

  })


  describe('/users/:userId/update', () => {

    it('return OK if route exists', async () => {
      
    })
  })

  describe('/users/:userId/delete', () => {
    it('return OK if route exists', async () => {
        
      })
  })
}) */