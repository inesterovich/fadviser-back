const morgan = require('morgan');
const winston = require('./config/logger');
const { PORT, MONGO_CONNECTION_STRING } = require('./config/config');
const app = require('./app');
const start = require('./start');

app.use(
  morgan(
    ':method :status :url :userId size req :req[content-length] res :res[content-length] - :response-time ms',
    {
      stream: winston.stream,
    },
  ),
);

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const loggerInfo = (port) => ({
  dbInfo() {
    return winston.info('Successfully connect to database');
  },

  serverInfo() {
    return winston.info(`Server is running on PORT ${port}`);
  },

  errorInfo(error) {
    return winston.error(`MongoDB Connection error: ${error.message}`);
  },

});

start(MONGO_CONNECTION_STRING,

  mongoConfig, PORT, loggerInfo, app);

process.on('unhandledRejection', (reason) => {
  process.emit('uncaughtException', reason);
});
