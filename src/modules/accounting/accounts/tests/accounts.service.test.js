const mongoose = require('mongoose');
const { ENTITY_EXISTS, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } = require('../../../../errors/appError');
const UserModel = require('../../../../users/user.model');
const AccountModel = require('../account.model');
const AccountService = require('../index');


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

    expect(AccountService).toBeDefined();
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
      expect(AccountService.getAll).toBeDefined();
    })

    it('gets account correctly', async () => {
      accountMockData.owner = user._id;
      const account = await AccountModel.create(accountMockData);

      const actualAccount = await AccountService.get(account._id);

      expect(actualAccount._id).toEqual(account._id);
     
      
    })

    it('throws NOT_FOUND_ERROR', async () => {
      await expect(AccountService.get(fakeAccountId))
        .rejects.toThrowError(NOT_FOUND_ERROR);
    })

    it('throws BAD_REQUEST error', async () => {
      await expect(AccountService.get()).rejects.toThrowError(BAD_REQUEST_ERROR);
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
      expect(AccountService.getAll).toBeDefined();
    })

    it('gets All accounts correctly', async () => {

      accountMockData.owner = user._id;
      await AccountModel.create(accountMockData);
      const fakeAccountMock = {
        name: 'Test 2',
        owner: user._id
      }

      await AccountModel.create(fakeAccountMock);

      const accounts = await AccountService.getAll(user._id);
      expect(accounts.length).toBe(2);

    })

    it('throws NOT_FOUND_ERROR', async () => {
      await expect(AccountService.getAll(user._id)).rejects.toThrowError(NOT_FOUND_ERROR);
    });

    it('throws BAD_REQUEST error', async () => {
      await expect(AccountService.getAll()).rejects.toThrowError(BAD_REQUEST_ERROR);
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
      expect(AccountService.create).toBeDefined();
    })

    it('creates account successfully', async () => {
      const account = await AccountService.create(accountMockData, user._id);
      expect(account.name).toBe(accountMockData.name);
    });

    it('creates account with one operation', async () => {
      const account = await AccountService.create(accountMockData, user._id);
      expect(account.operations.length).toBe(1);
    });

    it('creates account with not-a-null sum', async () => {
      const accountExtended = {
        ...accountMockData,
        sum: 523
      }

      const account = await AccountService.create(accountExtended, user._id);
      expect(account.sum).toEqual(accountExtended.sum);
      expect(account.operations[0].sum).toEqual(accountExtended.sum);
    })

    it('throws ENTITY_EXISTS error', async () => {
      await AccountService.create(accountMockData, user._id);
      await expect(AccountService.create(accountMockData, user._id)).rejects.toThrowError(ENTITY_EXISTS)
    });

    it('throws BAD_REQUEST error', async () => {
      await expect(AccountService.create()).rejects.toThrowError(BAD_REQUEST_ERROR);
    })

    it('throws other errors', async () => {
      await expect(AccountService.create(accountMockData)).rejects.toThrow();
    });


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
      expect(AccountService.update).toBeDefined();
    })

    it('update account succesfully', async () => {
      accountMockData.owner = user._id;
      const account = await AccountModel.create(accountMockData);
      const updatedName = 'Updated Name'
    

      const updateAccount = await AccountService.update(account._id, updatedName);
      expect(updateAccount.name).toBe(updatedName);
    })

    it('throws BAD_REQUEST error', async () => {
      await expect(AccountService.update()).rejects.toThrowError(BAD_REQUEST_ERROR);
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
      expect(AccountService.remove).toBeDefined();
    });

    it('removes account correctly', async () => {
      accountMockData.owner = user._id;
      const account = await AccountModel.create(accountMockData);

      await AccountService.remove(account._id);

      const expected = await AccountModel.findOne({ id: account._id});

      expect(expected).toBeFalsy();
    })

    it('throw BAD_REQUEST error if accointId is not passed', async () => {
      accountMockData.owner = user._id;

      await expect(AccountService.remove()).rejects.toThrowError(BAD_REQUEST_ERROR);

    
    })



  })





} )