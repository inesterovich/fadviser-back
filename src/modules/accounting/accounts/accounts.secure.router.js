const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');

const { OK, NO_CONTENT, CREATED } = StatusCodes;
const AccountService = require('./index');
const {
  checkToken, decodeToken, validateToken, userIdValidator,
} = require('../../../middleware/auth.middleware');
const { accountCreate } = require('../../../validation/schemas.validation');
const { validator } = require('../../../validation/validator');
const OperationSecureRouter = require('../operations/operation.secure.router');

const AcccountsSecureRouter = Router({ mergeParams: true });

AcccountsSecureRouter.all('*', checkToken, decodeToken, userIdValidator, validateToken);

AcccountsSecureRouter.get('/', async (req, res) => {
  const userAccounts = await AccountService.getAll(req.params.userId);

  return res.status(OK).json(userAccounts);
});

AcccountsSecureRouter.post('/',
  validator(accountCreate, 'body'),
  async (req, res) => {
    const { userId } = req.params;

    const account = await AccountService.create(req.body, userId);

    res.status(CREATED).json(account);
  });

AcccountsSecureRouter.get('/:accountId/', async (req, res) => {
  const account = await AccountService.get(req.params.accountId);

  res.status(OK).json(account);
});

AcccountsSecureRouter.put('/:accountId', async (req, res) => {
  const account = await AccountService.update(req.params.accountId, req.body.name);
  res.status(OK).json(account);
});

AcccountsSecureRouter.delete('/:accountId/', async (req, res) => {
  await AccountService.remove(req.params.accountId);

  return res.sendStatus(NO_CONTENT);
});

AcccountsSecureRouter.use('/:accountId', OperationSecureRouter);

module.exports = AcccountsSecureRouter;
