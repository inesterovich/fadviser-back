const { createAccount, deleteAccount} = require('./accounts.methods.db');

const create = async (accountData, userId) => await createAccount(accountData, userId);
const del = async (accountId) => await deleteAccount(accountId);
// Для каждой операции будет свой роут и я точно буду знать, что именно желает юзер

const AccountService = {
  create,
  del
}

module.exports = {
  AccountService
}