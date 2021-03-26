require('express-async-errors');
const winston = require('./config/logger');
const morgan = require('morgan');
const createError = require('http-errors');
const errorHandler = require('./resourses/errors/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { NOT_FOUND } = StatusCodes;
const userRouter = require('./resourses/users/user.router');


const { PORT, MONGO_CONNECTION_STRING } = require('./config/config');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const server = express();



server.use(helmet());
server.use(cors());
server.use(express.json({ extended: true }));
server.use(express.urlencoded({ extended: true }));

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


async function start() {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    winston.info('Successfully connect to database');
    server.listen(PORT, () => winston.info(`Server is running on PORT ${PORT}`))
  } catch (error) {
    winston.error(`MongoDB Connection error: ${error.message}`)
  }

}

start();


process.on('unhandledRejection', reason => {
  process.emit('uncaughtException', reason);
});






