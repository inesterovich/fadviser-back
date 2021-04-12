const { ENTITY_EXISTS, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } = require('../../../errors/appError');
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const ENTITY_NAME = 'Account';

const get = AccountModel => async (accountId) => {
  const account = await AccountModel.findOne({ _id: accountId })
 
  if (!account) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} not found`)
  };

  return account;
};
const getAll = AccountModel => async (userId) => {
  const accounts = await AccountModel.find({ owner: userId });
  if (!accounts.length) {
    throw new NOT_FOUND_ERROR(`This data not found`)
  };

  return accounts;
}

const create = AccountModel => async (accountData, userId) => {
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

const update = AccountModel =>  async (accountId, accountName) => {
  const account = await AccountModel.findOneAndUpdate(
    {
    _id: accountId
    },
    { name: accountName },
    { new: true }
  );

  return account;
}

const remove = AccountModel => async (accountId) => {
  try {

    if (!accountId) {
      throw new BAD_REQUEST_ERROR('accountId is required')
    }
   return await AccountModel.findOneAndRemove({ _id: accountId });

  } catch (error) {
    throw error;
  }
}




module.exports = AccountModel => {
  return {
    get: get(AccountModel),
    getAll: getAll(AccountModel),
    create: create(AccountModel),
    update: update(AccountModel),
    remove: remove(AccountModel),
    
  }
}