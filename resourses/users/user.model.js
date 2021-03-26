/* Папка, позволяющая создавать, изменять и удалять юзеров. Роуты авторизаии, регистрации и middleware тоже тут. Здесь userService , именно он используется в роутере для определения тех или иных действий 

Юзеры разных ролей: роль админа, роль пользователя. В дальнейшем список будет расширяться. Предусмотреть создание новые ролей из админки.
*/

const { Schema, model } = require('mongoose');

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


module.exports = model('User', UserSchema)