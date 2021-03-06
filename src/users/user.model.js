const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const randomString = require('randomstring');

const UserSchema = new Schema({
  name: {
    type: String,
    default: 'NoName',
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  login: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
    default: 'Example avatar',
  },

  userSecret: {
    type: String,
  },

});

UserSchema.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.userSecret = randomString.generate(7);
  next();
});

UserSchema.pre('findOneAndUpdate', async function preUpdate(next) {
  /* istanbul ignore else */
  if (this._update.$set.password) {
    this._update.$set.password = await bcrypt.hash(this._update.$set.password, 10);
  }

  this.userSecret = randomString.generate(7);

  next();
});

UserSchema.methods.toResponce = function () {
  const { _id, ...rest } = this.toJSON();
  delete rest.password;
  delete rest.userSecret;
  delete rest.__v;

  return {
    _id,
    ...rest,
  };
};

module.exports = model('User', UserSchema);
