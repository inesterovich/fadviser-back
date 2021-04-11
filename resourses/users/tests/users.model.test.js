const mongoose = require('mongoose');
const mongoTestURI = 'mongodb://localhost/fadviser-test';
mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(mongoTestURI, mongoConfig);

const
  { createUser, deleteUser, findUserByEmail, findUserByLogin, findUserById, updateUser }
    = require('../user.methods.db');

const UserModel = require('../user.model');
  
// Это у меня функции. К БД они какого-либо прямого отношения не имеют. 

  describe('User model:', () => {
  
    beforeAll( async () => {
      await UserModel.deleteMany({});
    })
    
    afterEach(async () => {
      await UserModel.deleteMany({});
    })

    afterAll(async () => {
      await mongoose.connection.close()
    })

    it('exists', () => {
      expect(UserModel).toBeDefined();
    })

    it('Saves a user', async () => {
      const userData = {
        email: 'tester@tester.ru',
        login: 'tester',
        password: '123456'
      }
      
      const user = new UserModel(userData);
      await user.save();

      const foundUser = await UserModel.findOne({ email: userData.email });
      const expectedEmail = userData.email;
      const actualEmail = foundUser.email;

      expect(actualEmail).toEqual(expectedEmail);

    })

  

  

    
    })