const AccountModel = require('./account.model');
const { OperationService } = require('../operations/operation.service');
const { ENTITY_EXISTS, NOT_FOUND_ERROR } = require('../../../errors/appError');
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const ENTITY_NAME = 'Account';

const createAccount = async (accountData, userId) => {
  
  try {
    const initialOperation = {
      date: new Date(),
      category: `Создание счёта ${accountData.name}`,
      operationType: 'Доход',
      sum: accountData.sum | 0
    }

    const data = {
      ...accountData,
      operations: [initialOperation],
      owner: userId
    }
    const account = await AccountModel.create(data);
    return account;
  } catch (error) {
    if (error.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this name already exists`)
    } else {
      throw error;
    }
  }
}

const deleteAccount = async (accountId) => {
  try {
   return await AccountModel.findOneAndRemove({ _id: accountId });

  } catch (error) {
    throw error;
  }
}

const findAccountById = async (accountId) => {
 
  const account = await AccountModel.findOne({ _id: accountId })
 
  if (!account) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} not found`)
  };

  return account;
};

const findUserAccounts = async (userId) => {
  const accounts = await AccountModel.find({ owner: userId });
  if (!account) {
    throw new NOT_FOUND_ERROR(`This data not found`)
  };

  return accounts;
};

const updateAccountName = async (accountId, accountName) => {
  const account = await findAccountById(accountId);
  account.name = accountName;
  await account.save();
  return account;
}



// Всё-таки нужны разные файлы. И OperationService

// Операции делаем вот тут. Они неотъемлемая часть счёта. 

/*
Счет можно создать. 
Счет можно обновить. 
Счет можно удалить.

Создать счет: создать счёт. Добавить операцию. Обновить сумму счёта.

*/

module.exports = {
  createAccount,
  findAccountById,
  deleteAccount,
  findUserAccounts,
  updateAccountName,

}