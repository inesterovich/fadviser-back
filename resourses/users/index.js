const UserModel = require('./user.model');
const userService = require('./user.service');

module.exports = userService(UserModel);