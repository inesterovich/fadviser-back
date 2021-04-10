const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;
const { AccountService } = require('./accounts.service');
const { checkToken, decodeToken, validateToken, userIdValidator } = require('../../../middleware/auth.middleware');
const { _id } = require('../../../validation/schemas.validation');
const { validator } = require('../../../validation/validator');
const OperationSecureRouter = require('../operations/operation.secure.router');

const AcccountsSecureRouter = Router({ mergeParams: true });

AcccountsSecureRouter.all('*', validator(_id, 'params'), checkToken, decodeToken, userIdValidator, validateToken);

AcccountsSecureRouter.post('/create', async (req, res) => {
  const { userId } = req.params;
  
  const account = await AccountService.create(req.body, userId);

  res.status(OK).json({ account });
})

AcccountsSecureRouter.use('/:accountId', OperationSecureRouter);



module.exports = AcccountsSecureRouter;