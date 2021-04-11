const UserModel = require('./user.model');
const { ENTITY_EXISTS, NOT_FOUND_ERROR } = require('../errors/appError');
const MONGO_ENTITY_EXISTS_ERROR_CODE = 11000;
const ENTITY_NAME = 'user'



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


