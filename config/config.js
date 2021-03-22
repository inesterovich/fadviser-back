const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
  debug: true,
});

module.exports = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOGS_DIR: process.env.LOGS_DIR,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRE_TIME: process.env.JWT_REFRESH_EXPIRE_TIME
};