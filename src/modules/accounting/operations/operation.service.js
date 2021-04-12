const {
  addOperation,
  updateOperation,

  deleteOperation }
  = require('./operations.methods.db');

const add = async (accountId, operationData) => await addOperation(accountId, operationData);
const update = async (accountId, operationData) => await updateOperation(accountId, operationData);
const del = async (accountId, operationId) => await deleteOperation(accountId, operationId);

const OperationService = {
  add,
  update,
  del
};

module.exports = {
  OperationService
}