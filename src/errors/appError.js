
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const {
  NOT_FOUND,
  EXPECTATION_FAILED,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  getStatusText,
} = StatusCodes;
class AppError extends Error {
  constructor(message) {
    super(message);
  };
};

class NotFoundError extends AppError {
  constructor(entity, params, message) {
    super(message || `Coudn't find a(an) ${entity}
    with ${params}
    `);
    this.status = NOT_FOUND;
  };
};

class BadRequestError extends AppError {
  constructor(message) {
    super(message);
    this.status = BAD_REQUEST;
  };
};

class EntityExistsError extends AppError {
  constructor(message) {
    super(message);
    this.status = EXPECTATION_FAILED;
  };
};
class AuthenticationError extends Error {
  constructor(message) {
    super(message || getReasonPhrase(FORBIDDEN));
    this.status = FORBIDDEN;
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message || getReasonPhrase(UNAUTHORIZED));
    this.status = UNAUTHORIZED;
  };
};


module.exports = {
  _APP_ERROR: AppError,
  NOT_FOUND_ERROR: NotFoundError,
  BAD_REQUEST_ERROR: BadRequestError,
  AUTHORIZATION_ERROR: AuthorizationError,
  AUTHENTICATION_ERROR: AuthenticationError,
  ENTITY_EXISTS: EntityExistsError
}