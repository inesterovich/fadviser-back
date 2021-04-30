const { ENTITY_EXISTS, NOT_FOUND_ERROR, BAD_REQUEST_ERROR } = require('../../../errors/appError');
const financeCategoriesModel = require('../finance-categories/finance.categories.model');

const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const ENTITY_NAME = 'Account';

const get = (AccountModel) => async (accountId) => {
  if (!accountId) throw new BAD_REQUEST_ERROR('accountId is missing');
  const account = await AccountModel.findOne({ _id: accountId }).populate('categories');

  if (!account) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} not found`);
  }

  return account;
};
const getAll = (AccountModel) => async (userId) => {
  if (!userId) throw new BAD_REQUEST_ERROR('userId is missing');
  const accounts = await AccountModel.find({ owner: userId }).populate('categories').lean();

  accounts.map((account) => {
    delete account.owner;
    delete account.categories;
    delete account.operations;
    delete account.__v;
    return account;
  });
  // В данном месте надо отдавать любой полученный результат

  return accounts;
};

const create = (AccountModel) => async (accountData, userId) => {
  try {
    if (!accountData || !userId) throw new BAD_REQUEST_ERROR('accountData and userId are required');

    let financeCategories = await financeCategoriesModel.findOne({ owner: userId });

    if (!financeCategories) {
      financeCategories = await financeCategoriesModel.create({ owner: userId });
    }

    const initialOperation = {
      date: new Date(),
      category: `Создание счёта ${accountData.name}`,
      operationType: 'Доход',
      sum: accountData.sum || 0,
    };

    const data = {
      ...accountData,
      operations: [initialOperation],
      categories: financeCategories._id,
      owner: userId,
    };
    const account = await AccountModel.create(data);

    return await AccountModel
      .findOne({ _id: account._id })
      .populate('categories');
  } catch (error) {
    if (error.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this name already exists`);
    } else {
      throw error;
    }
  }
};

const update = (AccountModel) => async (accountId, accountName) => {
  if (!accountId || !accountName) throw new BAD_REQUEST_ERROR('accountId and accountName are required');

  return await AccountModel.findOneAndUpdate(
    {
      _id: accountId,
    },
    { name: accountName },
    { new: true },
  ).populate('categories');
};

const remove = (AccountModel) => async (accountId) => {
  if (!accountId) {
    throw new BAD_REQUEST_ERROR('accountId is required');
  }
  return await AccountModel.findOneAndRemove({ _id: accountId });
};

module.exports = (AccountModel) => ({
  get: get(AccountModel),
  getAll: getAll(AccountModel),
  create: create(AccountModel),
  update: update(AccountModel),
  remove: remove(AccountModel),

});
