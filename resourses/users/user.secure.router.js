const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;
const { checkToken, decodeToken, validateToken, userIdValidator } = require('../middleware/auth.middleware');
const { userService } = require('./user.service');
const { _id, userUpdate } = require('../validation/schemas.validation');
const { validator } = require('../validation/validator');
const userSecureRouter = Router({ mergeParams: true });

userSecureRouter.all('*', validator(_id, 'params'), checkToken, decodeToken, userIdValidator, validateToken);

userSecureRouter.get('/', async (req, res) => {

  const { userId } = req;
  
  const userEntity = await userService.getById(userId);
  
  res.status(OK).json(userEntity);
  });

userSecureRouter.post('/update', validator(userUpdate, 'body'), async (req, res) => {

  req.body._id = req.params.userId;
  const userEntity = await userService.update(req.body);

res.status(OK).send(userEntity);



});

userSecureRouter.get('/delete', async (req, res) => {
const { userId } = req;
await userService.del(userId);

res.sendStatus(NO_CONTENT);
});



userSecureRouter.post('/test', (req, res, next) => {
  
  const { userId } = req;
  res.status(OK).json( userId );
})

module.exports = userSecureRouter;
