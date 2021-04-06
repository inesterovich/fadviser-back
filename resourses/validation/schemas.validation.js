const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Две схемы одного юзера на создание и на обновление?
// Сделать техническое поле type? И удалять его перед сохранением?
const schemas = {
  _id: Joi.object().options({ abortEarly: true, allowUnknown: true}),
  userCreate: Joi.object()
    .options({ abortEarly: true, allowUnknown: false })
    .keys({
      email: Joi.string().email().required(),
      login: Joi.string().required(),
      password: Joi.string().required(),
    }),
  userUpdate: Joi.object()
    .options({ abortEarly: true, allowUnknown: true })
    .keys({
      _id: Joi.objectId().required(),
      name: Joi.string().allow(''),
      email: Joi.string().email(),
      login: Joi.string(),
      password: Joi.string(),
      avatar: Joi.string()
    }),
  userLogin: Joi.object().options({ abortEarly: true, allowUnknown: false }).keys({
    login: Joi.string().required(),
    password: Joi.string().min(6).required()
  })
};


module.exports = schemas;
