/* eslint-disable*/
const mongoose = require('mongoose');
const { BAD_REQUEST_ERROR } = require('../../errors/appError');
const AccountModel = require('../../modules/accounting/accounts/account.model');
const AccountService = require('../../modules/accounting/accounts/index');
const OperationService = require('../../modules/accounting/operations/index');
const UserModel = require('../../users/user.model');

const mongoTestString = 'mongodb://127.0.0.1/fadviser_test';
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(mongoTestString, mongoConfig);

describe('OperationService:', () => {
  
  const userMock = {
    email: 'email@email.ru',
    login: 'login',
    password: 'password'
  };

  const accountMock = {
    name: 'Tested Account',
    sum: 0
  }

  let user;
  let account;

  const operationMocks = [
    {
    date: new Date('2021-04-01'),
    category: 'Зарплата',
    operationType: 'Доход',
    sum: 75000
    },

    {
      date: new Date('2021-04-09'),
      category: 'Зарплата',
      operationType: 'Доход',
      sum: 0.1
    },
    {
      date: new Date('2020-11-06'),
      category: 'Зарплата',
      operationType: 'Доход',
      sum: 0.2
    }
    
  
  ]
  
  beforeAll(async () => {
    await UserModel.deleteMany();
    await AccountModel.deleteMany();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  afterAll(async () => {
    await UserModel.deleteMany();
    await AccountModel.deleteMany();
    await mongoose.connection.close()
  });

  it('to be defined', () => {
    expect(OperationService).toBeDefined();
  })

  

  describe('add', () => {

    beforeAll(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

   
    beforeEach( async () => {
      user = await UserModel.create(userMock);
      account = await AccountService.create(accountMock, user._id);
     
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(OperationService.add).toBeDefined();
    });

    it('add operation successfully', async () => {
      const updatedAccount = await OperationService.add(account._id, operationMocks[0]);

      expect(updatedAccount.operations.length).toEqual(2);
    })

    it('account sum calculates correctly with integers', async () => {
      const sum = accountMock.sum + operationMocks[0].sum;
      const updatedAccount = await OperationService.add(account._id, operationMocks[0]);
      expect(updatedAccount.sum).toEqual(sum)
    })

    it('account sum calculates correctly with floating numbers', async () => {
      const sum = parseFloat((accountMock.sum + operationMocks[1].sum + operationMocks[2].sum).toFixed(2));
      await OperationService.add(account._id, operationMocks[1]);
      const updatedAccount = await OperationService.add(account._id, operationMocks[2]);
      expect(updatedAccount.sum).toStrictEqual(sum);
    })


    it('sorts operations correctly', async () => {
      await OperationService.add(account._id, operationMocks[0]);
      await OperationService.add(account._id, operationMocks[1]);
      const updatedAccount = await OperationService.add(account._id, operationMocks[2]);
      const expectedBool = updatedAccount.operations[1].date <= updatedAccount.operations[1].date;
      expect(expectedBool).toBeTruthy();
    })

    it('date of first operation changes correctly', async () => {
      await OperationService.add(account._id, operationMocks[0]);
      await OperationService.add(account._id, operationMocks[1]);
      const finalAccount = await OperationService.add(account._id, operationMocks[2]);

      const expectedBool = finalAccount.operations[0].date <= finalAccount.operations[1].date;

      expect(expectedBool).toBeTruthy();

    })

    it('throws BAD_REQUEST error is params not passes', async () => {
      await expect(OperationService.add()).rejects.toThrowError(BAD_REQUEST_ERROR);
    })

    
  })

  describe('update', () => {

    let updatedOperation;

    beforeAll(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

   
    beforeEach( async () => {
      user = await UserModel.create(userMock);
      account = await AccountService.create(accountMock, user._id);

      await OperationService.add(account._id, operationMocks[0]);
      await OperationService.add(account._id, operationMocks[1]);
      account = await OperationService.add(account._id, operationMocks[2]);

      updatedOperation = {
        _id: account.operations[1]._id,
        date: new Date('2021-03-05'),
        category: 'Updated Data',
        operationType: 'Expences',
        sum: 100
      }
     
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(OperationService.update).toBeDefined();
    });

    

    it('update operation successfully', async () => {

    

      const updatedAccount = await OperationService.update(account._id, updatedOperation);

    

      const actualOperation = updatedAccount.operations.find(operation => String(operation._id) === String(updatedOperation._id));

      expect(actualOperation.category).toBe(updatedOperation.category);
        
   

  
      

    
    })


    it('updates sum correctly with numbers', async () => {
      const expectedSum = account.sum - account.operations[1].sum + updatedOperation.sum;

      const updatedAccount = await OperationService.update(account._id, updatedOperation);

      expect(updatedAccount.sum).toBe(expectedSum);
    });

    it('updates sum correctly with floats', async () => {
      const floatUpdatedOperation = {
        ...updatedOperation,
        sum: 0.1 + 0.2
      }
      const updatedAccount = await OperationService.update(account._id, floatUpdatedOperation);

      const expectedSum = parseFloat((account.sum - account.operations[1].sum + floatUpdatedOperation.sum).toFixed(2));

      expect(updatedAccount.sum).toEqual(expectedSum);
      
    })

    it('sorts operation correctly', async () => {
      const updatedAccount = await OperationService.update(account._id, updatedOperation);
      const sortBoolean = updatedAccount.operations[1].date <= updatedAccount.operations[2].date;

      expect(sortBoolean).toBeTruthy();
      
    })

    it('changes date of first operation correctly', async () => {
      const datedOperation = {
        ...updatedOperation,
        date: new Date('2020-10-20')
      }

      const updatedAccount = await OperationService.update(account._id, datedOperation);
      const dateBoolean = updatedAccount.operations[0].date <= updatedAccount.operations[1].date;
      expect(dateBoolean).toBeTruthy();

    });

    it('throws BAD_REQUEST error if date of initial operation is greater than next operation', async () => {
      const initialUpdatedOperation = {
        ...updatedOperation,
        _id: account.operations[0]._id,
        date: new Date('2022-05-03')
      };

      await expect(OperationService.update(account._id, initialUpdatedOperation)).rejects.toThrowError(BAD_REQUEST_ERROR);

    })

    it('throws BAD_REQUEST error if params not passed', async () => {
      await expect(OperationService.update()).rejects.toThrowError(BAD_REQUEST_ERROR);
    })

    

   
    



 


  })

  describe('remove', () => {

    let accountId;
    let operationId;

    beforeAll(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

   
    beforeEach( async () => {
      
      user = await UserModel.create(userMock);
      
      account = await AccountService.create(accountMock, user._id);
      
      await OperationService.add(account._id, operationMocks[0]);
      await OperationService.add(account._id, operationMocks[1]);
      account = await OperationService.add(account._id, operationMocks[2]);
      
      accountId = account._id;
      operationId = account.operations[1]._id;

      
    })

    afterEach(async () => {
      await UserModel.deleteMany();
      await AccountModel.deleteMany();
    })

    it('to be defined', () => {
      expect(OperationService.remove).toBeDefined();
    })

    

    it('removes operation successfully', async () => {
      const operationsLength = account.operations.length;
      const updatedAccount = await OperationService.remove(accountId, operationId);
      const expected = updatedAccount.operations.length < operationsLength;
      expect(expected).toBeTruthy();
    });

    it('updates sum correctly', async () => {
      const expectedSum = Number((account.sum - account.operations[1].sum).toFixed(2));
      const updatedAccount = await OperationService.remove(accountId, operationId);

      expect(updatedAccount.sum).toBe(expectedSum);

    });

    it('throw BAD_REQUEST error if invokes without param', async () => {

      await expect(OperationService.remove()).rejects.toThrowError(BAD_REQUEST_ERROR);
    })
    
  })


})