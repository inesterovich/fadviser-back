const UserModel = require('./user.model');


const createUser = async(userData) => {
  return await UserModel.create(userData);
};

const findUserById = async (id) => {
  return await UserModel.findOne({ _id: id });
}

const findUserByLogin = async (login) => {
  return await UserModel.findOne({ login});
}

const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
}

const updateUser = async (id, login, email, password, name, avatar) => {

  return await UserModel.findOneAndUpdate({ _id: id }, {
    $set: {
      login,
      email,
      password,
      name,
      avatar
    }
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


