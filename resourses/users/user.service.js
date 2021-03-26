const { createUser,
  findUserById,
  findUserByLogin,
  findUserByEmail,
  updateUser,
  deleteUser } = require('./user.methods.db');

  /*
  Именно этот роут делает дополнительные проверки. Ну то есть, копирует будущие роуты.
  От самих роутов задача - вытащить нужные данные, вызвать нужную функцию и выслать ответ. 
  
  */

const UserService = {
  register: async (userData) => {

    const { email, login } = userData;
    
    const userEmailExists = await findUserByEmail(email);
    const userLoginExists = await findUserByLogin(login);
      // По хорошему, здесь бы ошибку выкинуть и перехватить обработчиками. 
    if (userEmailExists || userLoginExists) {
      return {
        message: 'User already exists'
      }
    }

    return await createUser(userData);


    }
  }