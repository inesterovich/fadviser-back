const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
  debug: false,
});

module.exports = {
  PORT: process.env.PORT,
  LOGS_DIR: process.env.LOGS_DIR,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  URL: process.env.URL,
  JWT_EXPIRE_TIME: process.env.JWT_EXPIRE_TIME,
  JWT_REFRESH_EXPIRE_TIME: process.env.JWT_REFRESH_EXPIRE_TIME,
};
