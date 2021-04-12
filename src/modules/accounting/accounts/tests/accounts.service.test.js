const mongoose = require('mongoose');
const { ENTITY_EXISTS, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } = require('../../../../errors/appError');
const UserModel = require('../../../../users/user.model');
const AccountModel = require('../account.model');
const accountService = require('../index');


const mongoTestString = 'mongodb://127.0.0.1/fadviser_test';
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(mongoTestString, mongoConfig);


describe('AccountService:', () => {

  beforeAll( async () => {
    await UserModel.deleteMany();
  })

  afterEach(async () => {
    await UserModel.deleteMany();
  })

  afterAll( async () => {
    await UserModel.deleteMany();
    await AccountModel.deleteMany();
    await mongoose.connection.close()
  })

  /* Перед каждым тестом мне всегда нужен готовый юзер */
  it('to be defined', () => {

    expect(accountService).toBeDefined();
  });
  let userMockData = {
    login: 'developer',
    email: 'dev@dev.ru',
    password: '123456'
  }
  const accountMockData = {
    name: 'Test account'
  };

  let user;
  let userId;

  let fakeAccountId = '6074688473a1e43514a3d60e';
  describe('get', () => {
    beforeEach( async () => {
      user = await UserModel.create(userMockData);
      await AccountModel.deleteMany();
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(accountService.getAll).toBeDefined();
    })

    it('gets account correctly', async () => {
      accountMockData.owner = user._id;
      const account = await accountModel.create(accountMockData);

      const actualAccount = await accountService.get(account._id);

      expect(actualAccount._id).toEqual(account._id);
     
      
    })

    it('throws NOT_FOUND_ERROR', async () => {
      await expect(accountService.get(fakeAccountId))
        .rejects.toThrowError(NOT_FOUND_ERROR);
    })
  });

  describe('getAll', () => {
    beforeEach( async () => {
      user = await UserModel.create(userMockData);
      await AccountModel.deleteMany();
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(accountService.getAll).toBeDefined();
    })

    it('gets All accounts correctly', async () => {

      accountMockData.owner = user._id;
      await accountModel.create(accountMockData);
      const fakeAccountMock = {
        name: 'Test 2',
        owner: user._id
      }

      await accountModel.create(fakeAccountMock);

      const accounts = await accountService.getAll(user._id);
      expect(accounts.length).toBe(2);

    })

    it('throws NOT_FOUND_ERROR', async () => {
      await expect(accountService.getAll(user._id)).rejects.toThrowError(NOT_FOUND_ERROR);
    })
  })

  describe('create', () => {
    beforeEach( async () => {
      user = await UserModel.create(userMockData);
      await AccountModel.deleteMany();
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })


    it('to be defined', () => {
      expect(accountService.create).toBeDefined();
    })

    it('creates account successfully', async () => {
      const account = await accountService.create(accountMockData, user._id);
      expect(account.name).toBe(accountMockData.name);
    })

    it('catches ENTITY_EXISTS error', async () => {
      await accountService.create(accountMockData, user._id);
      await expect(accountService.create(accountMockData, user._id)).rejects.toThrowError(ENTITY_EXISTS)
    });

    it('catched other error', async () => {
      await expect(accountService.create(accountMockData)).rejects.toThrow();
    })


  })

  describe('update', () => {

    beforeEach( async () => {
      user = await UserModel.create(userMockData);
      await AccountModel.deleteMany();
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
      delete accountMockData.owner;
    })

    it('to be defined', () => {
      expect(accountService.update).toBeDefined();
    })

    it('update account succesfully', async () => {
      accountMockData.owner = user._id;
      const account = await accountModel.create(accountMockData);
      const updatedName = 'Updated Name'
    

      const updateAccount = await accountService.update(account._id, updatedName);
      expect(updateAccount.name).toBe(updatedName);
    })
  })

 

  describe('remove', () => {
    beforeEach( async () => {
      user = await UserModel.create(userMockData);
      await AccountModel.deleteMany();
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(accountService.remove).toBeDefined();
    });

    it('removes account correctly', async () => {
      accountMockData.owner = user._id;
      const account = await accountModel.create(accountMockData);

      await accountService.remove(account._id);

      const expected = await accountModel.findOne({ id: account._id});

      expect(expected).toBeFalsy();
    })

    it('throw BAD_REQUEST error if accointId is not passed', async () => {
      accountMockData.owner = user._id;

      await expect(accountService.remove()).rejects.toThrowError(BAD_REQUEST_ERROR);

    
    })



  })





} )