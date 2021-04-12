const AccountModel = require('./account.model');
const AccountService = require('./accounts.service');

module.exports = AccountService(AccountModel);