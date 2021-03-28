const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { INTERNAL_SERVER_ERROR } = StatusCodes;
const logger = require('../../config/logger');

const errorHandler = (err, req, res, next) => {

  if (err.status) {
    // Мне немного неудобно
    res.status(err.status).send(err.message);
  } else {
    logger.error(err.stack);
    res
      .status(INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(INTERNAL_SERVER_ERROR));
  }

  next();
}

module.exports = errorHandler;
