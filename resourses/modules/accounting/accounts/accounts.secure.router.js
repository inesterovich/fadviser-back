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

AcccountsSecureRouter.post('/create', validator(accountCreate, 'body'),
  async (req, res) => {
  const { userId } = req.params;
  
  const account = await AccountService.create(req.body, userId);

  res.status(OK).json({ account });
  })

AcccountsSecureRouter.post('/:accountId/delete', async (req, res) => {
 
  await AccountService.del(req.params.accountId);

  return res.sendStatus(NO_CONTENT);
})


AcccountsSecureRouter.use('/:accountId', OperationSecureRouter);



module.exports = AcccountsSecureRouter;