const AuthMiddleware = require('../../middleware/auth.middleware');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');
const { AUTHENTICATION_ERROR, AUTHORIZATION_ERROR } = require('../../errors/appError');
const { StatusCodes } = require('http-status-codes');
const { FORBIDDEN } = StatusCodes;
const UserService = require('../../users/index');

describe('AuthMiddleware', () => {
  let userId = '6078800db457a8b8f76c5302'
  let token;
  let secret = 'testSecret';
  const next = () => {}

  beforeAll(async () => {
    
    token = jwt.sign(
      { userId },
      secret,
      { expiresIn: '4h' }
    );
  })



  describe('checkToken', () => {
   
    it('should be defined', () => {
      expect(AuthMiddleware.checkToken).toBeDefined();
    });

    it('set req.token if token provided', () => {
      const request = {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
      const res = {

      }

      AuthMiddleware.checkToken(request, res, next);

      expect(request?.token).toBe(token);


    });

    it('throws AUTHORIZATION_ERROR if token missing', async () => {
  
      try {
        const request = {
          headers: {
           
          }
        }
        const res = {}

        AuthMiddleware.checkToken(request, res, next)

      } catch (error) {
        expect(error).toBeInstanceOf(AUTHORIZATION_ERROR);
      }

    
    });

  })

  describe('decodeToken', () => {

    it('should be defined', () => {
      expect(AuthMiddleware.decodeToken).toBeDefined();
    })

    it('set req.userId if decode succesfully', () => {
      const req = {
        token
      };

      const res = {

      }

      AuthMiddleware.decodeToken(req, res, next);
      expect(req?.userId).toBe(userId);
    })


  })

  describe('userIdValidator', () => {
    
    
    it('should be defined', () => {
      expect(AuthMiddleware.userIdValidator).toBeDefined()
    });

    it('should return undefined if userId matched with params', () => {

      const req = {
        userId,
        params: {
          userId
        }
      }

      const res = {
        sendStatus(status) {
          this.status = status
        },

      }

      AuthMiddleware.userIdValidator(req, res, next);
      expect(res?.status).toBeUndefined();

    })

    it('shoud return forbidden if userId does not match with params',() => {
      const req = {
        userId,
        params: {
          userId: '1234568'
        }
      }

      const res = {
        sendStatus(status) {
          this.status = status
        },

      }

      AuthMiddleware.userIdValidator(req, res, next);
      expect(res?.status).toBe(FORBIDDEN);
    })


  })

  describe('validateToken', () => {


    

    it('should be defined', () => {
      expect(AuthMiddleware.validateToken).toBeDefined()
    });

    it('should return undefined if token valid', async () => {

      jest.spyOn(UserService, 'getById').mockResolvedValueOnce({
        userSecret: secret
      })

      const req = {
        token,
        userId
      };

      const res = {

      }

      await expect(AuthMiddleware.validateToken(req, res, next)).resolves.toBeUndefined();
      
      
    })

    it('should throw AUTHORIZATION_ERROR if token invalid', async () => {

      jest.spyOn(UserService, 'getById').mockResolvedValueOnce({
        userSecret: 'fakeSecret'
      })

      const req = {
        token,
        userId
      };

      const res = {

      }

      await expect(AuthMiddleware.validateToken(req, res, next)).rejects.toThrowError(AUTHORIZATION_ERROR)

    })
  })
})