const { Router } = require('express');
const { OperationService } = require('./operation.service');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;

const OperationSecureRouter = Router({ mergeParams: true});


//baseURL/users/:userId/accounts/:accountId/add
OperationSecureRouter.post('/add', async (req, res) => {

  const account = await OperationService.add(req.params.accountId, req.body);

 res.status(OK).json(account);
  

});
//baseURL/users/:userId/accounts/:accountId/:operationId/update
OperationSecureRouter.post('/:operationId/update', async (req, res) => {
  // Нужен ли такой длинный линк? Что именно я буду отправлять в data?

  const account = await OperationService.update(req.params.accountId, req.body);

  res.status(OK).json(account);
});

// Возможно нужно геттер на одну операцию

//baseURL/users/:userId/accounts/:accountId/:operationId/delete
OperationSecureRouter.post('/:operationId/delete', async (req, res) => {
  const account = await OperationService.del(req.params.accountId, req.params.operationId);
  // Нужна проверка на несуществующую операцию

return res.status(OK).json(account);
});


module.exports = OperationSecureRouter;
