const { StatusCodes } = require('http-status-codes');

const { BAD_REQUEST } = StatusCodes;

const errorResponse = (errors) => ({
  status: 'failed',
  errors: errors.map((err) => {
    const { path, message } = err;
    return { path, message };
  }),
});

const validator = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req[property]);
  if (error) {
    res
      .status(BAD_REQUEST)
      .json({ error: errorResponse(error.details) });
  } else {
    next();
  }
};

module.exports = {
  validator,
};
