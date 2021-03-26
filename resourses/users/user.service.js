const { createUser,
  findUserById,
  findUserByLogin,
  findUserByEmail,
  updateUser,
  deleteUser } = require('./user.methods.db');



const register = async (userData) => await createUser(userData);
const getById = async (userId) => await findUserById(userId);
const getByLogin = async (login) => await findUserByLogin(login);
const getByEmail = async (email) => await findUserByEmail(email);
const update = async (userData) => await updateUser(userData);
const del = async (userId) => await deleteUser(userId);
  
const userService =   {
  register,
  getById,
  getByLogin,
  getByEmail,
  update
}

module.exports = {
  userService
}