const { Router, raw } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK, CREATED, NO_CONTENT } = StatusCodes;
const { userService } = require('./user.service');
const { validator } = require('../validation/validator');
const { userCreate,  userLogin } = require('../validation/schemas.validation');

const userRouter = Router();

const userSecureRouter = require('./user.secure.router');


userRouter.post('/register', validator(userCreate, 'body'), async (req, res) => {
   await userService.register(req.body);
  return res.sendStatus(CREATED);
 });

userRouter.post('/login', validator(userLogin, 'body'), async (req, res) => {
  const { login, password } = req.body;
  
  const userTokens = await userService.login(login, password);

 return res.status(OK).json(userTokens);

});

userRouter.use('/:userId', userSecureRouter)


 
// Зачем мне сейчас UUID ? Он мне нужен только для обновлений. Для проверки существующих роутов - нет

// Auth
/*

 



*/



module.exports = userRouter;