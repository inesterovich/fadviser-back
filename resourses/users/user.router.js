const { Router } = require('express');

const userRouer = Router();

/*
Использую только GET и POST - практически все данные отправляются через формы, которые умеют только это
*/
userRouer.post('/users/register', async (req, res) => { });

userRouter.post('/users/login', async (req, res) => { });

userRouer.post('/users/update', async (req, res) => { });

userRouer.post('/users/update', async (req, res) => { });

userRouer.get('/users/:userId', async (req, res) => { });

// Роль юзера минимально заканчивается тут




module.exports = userRouer;