const { createUser,
  findUserById,
  findUserByLogin,
  findUserByEmail,
  updateUser,
  deleteUser } = require('./user.methods.db');
const userModel = require('./user.model');
const bcrypt = require('bcryptjs');
const { AUTHENTICATION_ERROR } = require('../errors/appError');
const jwt = require('jsonwebtoken');
const { JWT_EXPIRE_TIME } = require('../../config/config');


const register = async (userData) => await createUser(userData);
const getById = async (userId) => await findUserById(userId);
const getByLogin = async (login) => await findUserByLogin(login);
const getByEmail = async (email) => await findUserByEmail(email);
const update = async (userData) => await updateUser(userData);
const del = async (userId) => await deleteUser(userId);


const login = async (userLogin, userPassword) => {
  const user = await getByLogin(userLogin); 

  const isValidPassword = bcrypt.compare(userPassword, user.password)
 
  if (!isValidPassword) {
    throw new AUTHENTICATION_ERROR('Wrong password');
  };

  const jwtSecretKey = user.userSecret;

  const token = jwt.sign(
    { userId: user._id },
    jwtSecretKey,
    { expiresIn: JWT_EXPIRE_TIME }
  );

  const expiredToken = jwt.sign(
    { userId: user._id,},
    jwtSecretKey,
    {expiresIn: '10s'}
    
  )

  return {
    token,
    expiredToken
  }
}
  
const userService =   {
  register,
  login,
  getById,
  getByLogin,
  getByEmail,
  update,
  del
}

module.exports = {
  userService
}