const mongoose = require('mongoose');
const userService = require('./index');
const UserModel = require('./user.model');
const { ENTITY_EXISTS, AUTHENTICATION_ERROR, BAD_REQUEST_ERROR, NOT_FOUND_ERROR } = require('../errors/appError');
const userModel = require('./user.model');

const mongoTestString = 'mongodb://127.0.0.1/fadviser_test';
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(mongoTestString, mongoConfig);


describe('UserService:', () => {

  beforeAll( async () => {
    await UserModel.deleteMany();
  })

  afterEach(async () => {
    await UserModel.deleteMany();
  })

  afterAll( async () => {
    await UserModel.deleteMany();
    await mongoose.connection.close()
  })
  
  it('module exist', () => {
    expect(userService).toBeDefined();
  });


  
  describe('get User correctly', () => {

    let userMockData = {
      login: 'dev',
      email: 'dev@dev.ru',
      password: '123456'
    };

    let user;
    let userId;
    
    beforeEach(async () => {
      await userModel.create(userMockData);
      user = await userModel.findOne({ login: userMockData.login });
      userId = user._id;
    });

    afterEach(async () => {
      await userModel.deleteMany();
    })

    afterAll(async () => {
      await userModel.deleteMany();
    })

    it('to be defined', () => {
      expect(userService.getById).toBeDefined();
      expect(userService.getByEmail).toBeDefined();
      expect(userService.getByLogin).toBeDefined();
    })

    it('getters works properly', async () => {
      const userById = await userService.getById(user._id);
      const userByEmail = await userService.getByEmail(user.email);
      const userByLogin = await userService.getByLogin(user.login);
      expect(userById).toBeDefined();
      expect(userByEmail).toBeDefined();
      expect(userByLogin).toBeDefined();
    });

    it('throws NOT_FOUND_ERROR with fake data', async () => {
      const fakeUserId = '456788654345';
      const fakeEmail = 'fakery@fake.ru';
      const fakeLogin = 'FakeLogin';

      await expect(userService.getById(fakeUserId)).rejects.toThrowError(NOT_FOUND_ERROR);
      await expect(userService.getByEmail(fakeEmail)).rejects.toThrowError(NOT_FOUND_ERROR);
      await expect(userService.getByLogin(fakeLogin)).rejects.toThrowError(NOT_FOUND_ERROR);
     
    })



  })

  
  describe('register', () => {
    
    
    it('to be defined', () => {
      
      expect(userService.register).toBeDefined()
      
    })

    it('creates new user', async () => {
      const userMockData = {
        login: 'dev',
        email: 'dev@dev.ru',
        password: '123456'
      }

      const user = await userService.register(userMockData);

      expect(user.login).toEqual(userMockData.login);

    });

    it('hashes userPassword', async () => {
      const userMockData = {
        login: 'dev',
        email: 'dev@dev.ru',
        password: '123456'
      }

      const user = await userService.register(userMockData);
      expect(user.password).not.toEqual(userMockData.password);

    });

    
    
    it('throws error if user with same email exists', async () => {
      const userFirst = {
        login: 'dev',
        email: 'dev@dev.ru',
        password: '123456'
      };

      const userSecond = {
        login: 'dev',
        email: 'depo@dev.ru',
        password: '123456'
      };

      await userService.register(userFirst);
      await expect(userService.register(userSecond)).rejects.toThrowError(ENTITY_EXISTS);


  

    })

    it('throws error with missing data', async () => {
      const userWithoutLogin = {
        email: 'dev@dev.ru',
        password: '123456'
      };

      await expect(userService.register(userWithoutLogin)).rejects.toThrow();


    })




   


  });

  describe('login', () => {
    let userMockData = {
      login: 'dev',
      email: 'dev@dev.ru',
      password: '123456'
    };

    let user;
    let userId;
    
    beforeEach(async () => {
      await userModel.create(userMockData);
      user = await userModel.findOne({ login: userMockData.login });
      userId = user._id;
    });

    afterEach(async () => {
      await userModel.deleteMany();
    })

    afterAll(async () => {
      await userModel.deleteMany();
    })

    it('to be defined', () => {
      expect(userService.login).toBeDefined();
    })

    it('get token successfully', async () => {

      const data = await userService.login(userMockData.login, userMockData.password);

      expect(data.token).toBeDefined();
    })

    it('get userId successfully', async () => {
      const data = await userService.login(userMockData.login, userMockData.password);

      expect(data._id).toBeDefined();
    })

    it('throws authentication error with bad credentials', async () => {
       await expect(userService.login(userMockData.login, 'wrongpassword')).rejects.toThrowError(AUTHENTICATION_ERROR);
    })

    it('throws not found error with unregistered user', async () => {
      await expect(userService.login('fakeLogin', userMockData.password)).rejects.toThrowError(NOT_FOUND_ERROR);
    })

  })

  describe('update', () => {
    let userMockData = {
      login: 'dev',
      email: 'dev@dev.ru',
      password: '123456'
    };

    let user;
    let userId;
    
    beforeEach(async () => {
      await userModel.create(userMockData);
      user = await userModel.findOne({ login: userMockData.login });
      userId = user._id;
    });

    afterEach(async () => {
      await userModel.deleteMany();
    })

    afterAll(async () => {
      await userModel.deleteMany();
    })

    it('Updated user correctly', async () => {
      const userUpdate = {
        login: 'dev',
        email: 'maria@dev.ru',
        password: '123456'
      };

      userUpdate._id = userId;

      const user = await userService.update(userUpdate);

      expect(user.email).toEqual(userUpdate.email);

      

  
    })
    
    it('saves user._id after update', async() => {
      const userUpdate = {
        login: 'dev',
        email: 'maria@dev.ru',
        password: '123456'
      };

      userUpdate._id = userId;

      const user = await userService.update(userUpdate);

      expect(user._id).toBeDefined();
    })

    it('hashes password after update', async () => {
      const userUpdate = {
        login: 'dev',
        email: 'maria@dev.ru',
        password: '1234567890'
      };

      userUpdate._id = userId;

      const user = await userService.update(userUpdate);

      expect(user.password).not.toEqual(userUpdate.password);
    })

    it('throws error is ._id is not passes', async () => {
      const userUpdate = {
        login: 'dev',
        email: 'maria@dev.ru',
        password: '1234567890'
      };

      await expect(userService.update(userUpdate)).rejects.toThrowError(BAD_REQUEST_ERROR);
      
    })

    it('throw NOT_FOUND if user does not exist', async () => {
      const userUpdate = {
        login: 'dev',
        email: 'maria@dev.ru',
        password: '1234567890'
      };

      userUpdate._id = '4edd40c86762e0fb12000003';
      
      await expect(userService.update(userUpdate)).rejects.toThrow();
    })


    it('User collection after error is not changed', async () => {
      const fakeUserId = mongoose.Types.ObjectId('4edd40c86762e0fb12000003') ;
      try {
       await userService.getById(fakeUserId)
      } catch (error) {
       
      }

      const userCollection = await userModel.find({});
      expect(userCollection.length).toEqual(1);

    
    })

  })
  
  describe('remove', () => {
    let userMockData = {
      login: 'dev',
      email: 'dev@dev.ru',
      password: '123456'
    };

    let user;
    let userId;
    
    beforeEach(async () => {
      await userModel.create(userMockData);
      user = await userModel.findOne({ login: userMockData.login });
      userId = user._id;
    });

    afterEach(async () => {
      await userModel.deleteMany();
    })

    afterAll(async () => {
      await userModel.deleteMany();
    })

    it('to be defined', () => {
      expect(userService.remove).toBeDefined()
    })

    it('deletes user properly', async () => {
      await userService.remove(userId);
      const userCollection = await UserModel.find({});
      expect(userCollection.length).toEqual(0);
    });

    it('does not change collection with bad _id', async () => {
      const fakeUserId = mongoose.Types.ObjectId('4edd40c86762e0fb12000003') ;
      await userService.remove(fakeUserId);

      const userCollection = await UserModel.find({});
      expect(userCollection.length).toEqual(1);
    })
  })

  

 
})