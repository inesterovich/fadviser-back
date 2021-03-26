const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { OK, NO_CONTENT } = StatusCodes;
const { userService } = require('./user.service');
const userRouter = Router();


/*
Использую только GET и POST - практически все данные отправляются через формы, которые умеют только это
*/
userRouter.post('/register', async (req, res) => {
  const userEntity = await userService.register(req.body);

  res.status(OK).send(userEntity);



 });

userRouter.post('/login', async (req, res) => { });

userRouter.post('/update', async (req, res) => { });

userRouter.post('/delete', async (req, res) => { });

userRouter.get('/:userId', async (req, res) => { });

// Роль юзера минимально заканчивается тут




module.exports = userRouter;