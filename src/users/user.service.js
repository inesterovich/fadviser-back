const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  AUTHENTICATION_ERROR, NOT_FOUND_ERROR, ENTITY_EXISTS, BAD_REQUEST_ERROR,
} = require('../errors/appError');
const { JWT_EXPIRE_TIME } = require('../../config/config');

const ENTITY_NAME = 'user';
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const AccountModel = require('../modules/accounting/accounts/account.model');

const getById = (UserModel) => async (id) => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
};
const getByLogin = (UserModel) => async (login) => {
  const user = await UserModel.findOne({ login });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { login });
  }
  return user;
};

// Сделать один геттер
const getByEmail = (UserModel) => async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }
  return user;
};

const register = (UserModel) => async (userData) => {
  try {
    return await UserModel.create(userData);
  } catch (error) {
    if (error.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this login or email already exists`);
    } else {
      throw error;
    }
  }
};

const login = (UserModel) => async (userLogin, userPassword) => {
  const user = await UserModel.findOne({ login: userLogin });

  if (!user) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} not found`);
  }

  const isValidPassword = await bcrypt.compare(userPassword, user.password);

  if (!isValidPassword) {
    throw new AUTHENTICATION_ERROR('Wrong password');
  }

  const jwtSecretKey = user.userSecret;

  const token = jwt.sign(
    { userId: user._id },
    jwtSecretKey,
    { expiresIn: JWT_EXPIRE_TIME },
  );

  return {
    _id: user._id,
    token,

  };
};
const update = (UserModel) => async (userData) => {
  const { _id } = userData;

  if (!_id) {
    throw new BAD_REQUEST_ERROR('_id is neccessary for this operation');
  }

  const updateObject = {};
  Object.keys(userData).map((key) => updateObject[key] = userData[key]);

  const user = await UserModel.findOneAndUpdate({ _id }, {
    $set: updateObject,
  },
  { new: true });

  if (!user) {
    throw new NOT_FOUND_ERROR(`${ENTITY_NAME} is not exists`);
  }

  return user;
};
const remove = (UserModel) => async (id) => {
  await UserModel.findOneAndRemove({ _id: id });
  await AccountModel.deleteMany({ owner: id });
};

module.exports = (UserModel) => ({
  register: register(UserModel),
  login: login(UserModel),
  getById: getById(UserModel),
  getByEmail: getByEmail(UserModel),
  getByLogin: getByLogin(UserModel),
  update: update(UserModel),
  remove: remove(UserModel),

});
