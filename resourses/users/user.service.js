
const bcrypt = require('bcryptjs');
const { AUTHENTICATION_ERROR, NOT_FOUND_ERROR, ENTITY_EXISTS, BAD_REQUEST_ERROR } = require('../errors/appError');
const jwt = require('jsonwebtoken');
const { JWT_EXPIRE_TIME } = require('../../config/config');
const ENTITY_NAME = 'user'
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;


const getById = userModel => async (id) => {
  const user = await userModel.findOne({ _id: id });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
}
const getByLogin = userModel => async (login) => {
  const user = await userModel.findOne({ login });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { login });
  }
  return user;
}

// Сделать один геттер
const getByEmail = userModel => async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }
  return user;
}

const register = userModel => async (userData) => {
  try {
    return await userModel.create(userData);
  } catch (error) {
    if (error.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this login or email already exists`)
    } else {
      throw error;
    }
  }
  }

const login = userModel => async (login, password) => {
  const user = await userModel.findOne({ login });
  
  if (!user) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} not found`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
 
  if (!isValidPassword) {
    throw new AUTHENTICATION_ERROR('Wrong password');
  };

  const jwtSecretKey = user.userSecret;

  const token = jwt.sign(
    { userId: user._id },
    jwtSecretKey,
    { expiresIn: JWT_EXPIRE_TIME }
  );



  return {
    _id: user._id,
    token
    
  }
}
const update = userModel => async (userData) => {
  const { _id } = userData;

  if (!_id) {
    throw new BAD_REQUEST_ERROR('_id is neccessary for this operation')
  }

  const updateObject = {};

  for (key in userData) {
    if (key) {
      updateObject[key] = userData[key];
    }
  }

  const user = await userModel.findOneAndUpdate({ _id: _id  }, {
    $set: updateObject
  },
    { new: true}
  
  )

  if (!user) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} is not exists`);
  } 

  return user;
}
const remove = userModel => async (id) => {
  return await userModel.findOneAndRemove({ _id: id });
}





module.exports = userModel => {
  return {
    register: register(userModel),
    login: login(userModel),
    getById: getById(userModel),
    getByEmail: getByEmail(userModel),
    getByLogin: getByLogin(userModel),
    update: update(userModel),
    remove: remove(userModel)


  }
}


