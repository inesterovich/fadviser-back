const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');

const { OK, NO_CONTENT } = StatusCodes;
const {
  checkToken, decodeToken, validateToken, userIdValidator,
} = require('../middleware/auth.middleware');
const UserService = require('./index');
const { userUpdate } = require('../validation/schemas.validation');
const { validator } = require('../validation/validator');

const userSecureRouter = Router({ mergeParams: true });

userSecureRouter.all('*', checkToken, decodeToken, userIdValidator, validateToken);

userSecureRouter.get('/', async (req, res) => {
  const { userId } = req;

  const userEntity = await UserService.getById(userId);

  res.status(OK).json(userEntity.toResponce());
});

// Сделать get/put/delete

userSecureRouter.put('/', validator(userUpdate, 'body'), async (req, res) => {
  req.body._id = req.params.userId;
  const userEntity = await UserService.update(req.body);

  res.status(OK).send(userEntity.toResponce());
});

userSecureRouter.delete('/', async (req, res) => {
  const { userId } = req;
  await UserService.remove(userId);

  res.sendStatus(NO_CONTENT);
});

module.exports = userSecureRouter;
