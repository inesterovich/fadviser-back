const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;
const { AccountService } = require('./accounts.service');
const { checkToken, decodeToken, validateToken, userIdValidator } = require('../../../middleware/auth.middleware');
const { _id, accountCreate } = require('../../../validation/schemas.validation');
const { validator } = require('../../../validation/validator');
const OperationSecureRouter = require('../operations/operation.secure.router');

const AcccountsSecureRouter = Router({ mergeParams: true });

AcccountsSecureRouter.all('*', validator(_id, 'params'), checkToken, decodeToken, userIdValidator, validateToken);


AcccountsSecureRouter.get('/', async (req, res) => {
  const userAccounts = await AccountService.getAll(req.params.userId);

  return res.status(OK).json(userAccounts);
})
  
AcccountsSecureRouter.post('/create', validator(accountCreate, 'body'),
  async (req, res) => {
  const { userId } = req.params;
  
  const account = await AccountService.create(req.body, userId);

  res.status(OK).json({ account });
  })

  AcccountsSecureRouter.get('/:accountId/', async (req, res) => {
 
    const account = await AccountService.get(req.params.userId);

    res.status(OK).json(account);
  })




  // Нужен роут на получение всех аккаунтов, на получение одного акка
AcccountsSecureRouter.get('/:accountId/delete', async (req, res) => {
 
  await AccountService.del(req.params.accountId);

  return res.sendStatus(NO_CONTENT);
})


AcccountsSecureRouter.use('/:accountId', OperationSecureRouter);



module.exports = AcccountsSecureRouter;