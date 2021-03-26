const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  name: {
    type: String,
    default: ''
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  login: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
     default: 'Not Found'
  },

  userService: {
    // Тут будет отдельная схема или даже модель, предусматривающая возможность включить новые модули
  }  


})

UserSchema.pre('save', async function preSave(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next()
});

UserSchema.pre('findOneAndUpdate', async function preUpdate(next) {
  if (this._update.$set.password) {
    this._update.$set.password = await bcrypt.hash(this._update.$set.password, 10)
  }

  next();
})


module.exports = model('User', UserSchema)