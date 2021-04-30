const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schemas = {
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
      name: Joi.string().allow(''),
      email: Joi.string().email(),
      login: Joi.string(),
      password: Joi.string(),
      avatar: Joi.string(),
    }),
  userLogin: Joi.object().options({ abortEarly: true, allowUnknown: false }).keys({
    login: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),
  accountCreate: Joi.object().options({ abortEarly: true, allowUnknown: true }).keys({
    name: Joi.string().required(),
    accountType: Joi.string(),
  }),
  accountUpdate: Joi.object().options({ abortEarly: true, allowUnknown: true }).keys({
    _id: Joi.objectId().required(),
    name: Joi.string().required(),
    accountType: Joi.string(),
  }),
  operationCreate: Joi.object().options({ abortEarly: true, allowUnknown: true }).keys({
    date: Joi.date().required(),
    category: Joi.string().required(),
    operationType: Joi.string().required(),
    sum: Joi.number().required(),
  }),
  operationUpdate: Joi.object().options({ abortEarly: true, allowUnknown: true }).keys({
    _id: Joi.objectId().required(),
    date: Joi.date().required(),
    category: Joi.string().required(),
    operationType: Joi.string().required(),
    sum: Joi.number().required(),
  }),
};

module.exports = schemas;
