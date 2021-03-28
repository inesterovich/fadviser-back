const { Router, raw } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;
const { userService } = require('./user.service');

const userRouter = Router();

const userSecureRouter = require('./user.secure.router');


userRouter.post('/register', async (req, res) => {
  const userEntity = await userService.register(req.body);
  res.status(OK).send(userEntity);


 });

userRouter.post('/login', async (req, res) => {

 
  const { login, password } = req.body;
  
  const userTokens = await userService.login(login, password);

  res.status(OK).json(userTokens);

});

userRouter.use('/:userId', userSecureRouter)


 
// Зачем мне сейчас UUID ? Он мне нужен только для обновлений. Для проверки существующих роутов - нет

// Auth
/*

 



*/



module.exports = userRouter;