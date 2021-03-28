const UserModel = require('./user.model');
const { ENTITY_EXISTS, NOT_FOUND_ERROR } = require('../errors/appError');
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const ENTITY_NAME = 'user'


const createUser = async (userData) => {
  try {
    return await UserModel.create(userData);
  } catch (error) {
    if (error.code === MONGO_ENTITY_EXISTS_ERROR_CODE) {
      throw new ENTITY_EXISTS(`${ENTITY_NAME} with this login or email already exists`)
    } else {
      throw error;
    }
  }
  
};

const findUserById = async (id) => {
  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { id });
  }

  return user;
}

const findUserByLogin = async (login) => {
  const user = await UserModel.findOne({ login });

  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { login });
  }
  return user;
}

const findUserByEmail = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NOT_FOUND_ERROR(ENTITY_NAME, { email });
  }
  return user;
}

const updateUser = async (userData) => {

  const { _id } = userData;

  const updateObject = {};

  for (key in userData) {
    if (key) {
      updateObject[key] = userData[key];
    }
  }



  return await UserModel.findOneAndUpdate({ _id: _id  }, {
    $set: updateObject
  },
    { new: true}
  
  )
 


}

const deleteUser = async (id) => {
  return await UserModel.findOneAndRemove({ _id: id });
}


module.exports = {
  createUser,
  findUserById,
  findUserByLogin,
  findUserByEmail,
  updateUser,
  deleteUser
}


