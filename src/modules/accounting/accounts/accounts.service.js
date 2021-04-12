const { createAccount, deleteAccount, findAccountById, findUserAccounts} = require('./accounts.methods.db');

const create = async (accountData, userId) => await createAccount(accountData, userId);
const get = async (accountId) => await findAccountById(accountId);
const getAll = async (userId) => await findUserAccounts(userId);
const del = async (accountId) => await deleteAccount(accountId);
// Для каждой операции будет свой роут и я точно буду знать, что именно желает юзер

const AccountService = {
  create,
  get,
  getAll,
  del
}

module.exports = {
  AccountService
}