const { StatusCodes } = require('http-status-codes');
const {
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  FORBIDDEN } = StatusCodes;

const errorResponse = errors => {
  return {
    status: 'failed',
    errors: errors.map(err => {
      const { path, message } = err;
      return { path, message }
    })
  };
};

const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      res
        .status(BAD_REQUEST)
        .json({ error: errorResponse(error.details)})
    } else {
      next();
  }
  
  }
}

module.exports = {
  validator
}