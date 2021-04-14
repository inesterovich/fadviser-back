require('express-async-errors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const winston = require('./config/logger');
const morgan = require('morgan');
const createError = require('http-errors');
const errorHandler = require('./src/errors/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { NOT_FOUND } = StatusCodes;
const path = require('path');
const userRouter = require('./src/users/user.router');

const start = require('./start');


const swaggerDocument = YAML.load(path.join(__dirname, './docs/api.yaml'))

const { PORT, MONGO_CONNECTION_STRING } = require('./config/config');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const { loggers } = require('winston');
const server = express();



server.use(helmet());

const corsOptions = {
  methods: 'GET, POST'
}
server.use(cors(corsOptions));

server.use(express.json({ extended: true }));
server.use(express.urlencoded({ extended: true }));

server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
/*
По факту, я смогу попробовать посмотреть, что происходит с типичными запросами, когда сделаю доку для них
*/
/* App routes */
server.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running');
    return;
  }
  next();
})

server.use(
  morgan(
    ':method :status :url :userId size req :req[content-length] res :res[content-length] - :response-time ms',
    {
      stream: winston.stream
    }
  )
);

server.use('/users', userRouter);

server.use((req, res, next) => next(createError(NOT_FOUND)) )


server.use(errorHandler);
/*
const all_routes = require('express-list-endpoints');
console.log(all_routes(server));
*/


const loggerInfo = (port) => {
  return {
    dbInfo() {
      return winston.info('Successfully connect to database')
    },

    serverInfo() {
      return winston.info(`Server is running on PORT ${port}`)
    },

    errorInfo(error) {
      return winston.error(`MongoDB Connection error: ${error.message}`)
    }

  }
}

const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};



start(MONGO_CONNECTION_STRING,
  
  mongoConfig, PORT, loggerInfo, server);


process.on('unhandledRejection', reason => {
  process.emit('uncaughtException', reason);
});






