const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');

const { OK, CREATED } = StatusCodes;
const UserService = require('./index');
const { validator } = require('../validation/validator');
const { userCreate, userLogin } = require('../validation/schemas.validation');

const userRouter = Router();

const userSecureRouter = require('./user.secure.router');
const AcccountsSecureRouter = require('../modules/accounting/accounts/accounts.secure.router');

userRouter.post('/register', validator(userCreate, 'body'), async (req, res) => {
  await UserService.register(req.body);
  return res.sendStatus(CREATED);
});

userRouter.post('/login', validator(userLogin, 'body'), async (req, res) => {
  const { login, password } = req.body;

  const userTokens = await UserService.login(login, password);

  return res.status(OK).json(userTokens);
});

userRouter.use('/:userId', userSecureRouter);
userRouter.use('/:userId/accounts', AcccountsSecureRouter);
// Сюда накидываем модули

module.exports = userRouter;
