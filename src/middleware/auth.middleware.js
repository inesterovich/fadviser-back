
const { AUTHORIZATION_ERROR, AUTHENTICATION_ERROR } = require('../errors/appError');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { FORBIDDEN } = StatusCodes;
const UserService = require('../users/index');


const checkToken = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    req.token = token;
    next();

  } catch (error) {
    throw new AUTHORIZATION_ERROR('Token not found');
  }
  
}

const decodeToken = (req, res, next) => {

  const rawData = jwt.decode(req.token);

  req.userId = rawData.userId;
  next();


}



const userIdValidator = (req, res, next) => {
  if (req.userId !== req.params.userId) {
    res.sendStatus(FORBIDDEN)
  } else {
    next();
  }
  
}

const validateToken = async (req, res, next) => {
  const token = req.token;

  const user = await UserService.getById(req.userId);
  const secretKey = user.userSecret;

  try {
    jwt.verify(token, secretKey);
    next();
  } catch (error) {
    throw new AUTHORIZATION_ERROR(error.message);

  }

  


  

}

module.exports = {
  checkToken,
  decodeToken,
  validateToken,
  userIdValidator
}