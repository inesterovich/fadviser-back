const { Router } = require('express');
const OperationService = require('./index');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;
const { operationCreate, operationUpdate } = require('../../../validation/schemas.validation');
const { validator } = require('../../../validation/validator');

const OperationSecureRouter = Router({ mergeParams: true});


//baseURL/users/:userId/accounts/:accountId/add
OperationSecureRouter.post('/add', validator(operationCreate, 'body'),
  async (req, res) => {

  const account = await OperationService.add(req.params.accountId, req.body);

 res.status(OK).json(account);
  

});
//baseURL/users/:userId/accounts/:accountId/:operationId/update
OperationSecureRouter.post('/:operationId/update',
  validator(operationUpdate, 'body'), async (req, res) => {
  // Нужен ли такой длинный линк? Что именно я буду отправлять в data?

  const account = await OperationService.update(req.params.accountId, req.body);

  res.status(OK).json(account);
});

// Возможно нужно геттер на одну операцию

//baseURL/users/:userId/accounts/:accountId/:operationId/delete
OperationSecureRouter.get('/:operationId/delete',  async (req, res) => {
  const account = await OperationService.remove(req.params.accountId, req.params.operationId);
  // Нужна проверка на несуществующую операцию

return res.status(OK).json(account);
});


module.exports = OperationSecureRouter;

