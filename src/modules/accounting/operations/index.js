const AccountModel = require('../accounts/account.model');
const OperationService = require('./operation.service');

module.exports = OperationService(AccountModel);