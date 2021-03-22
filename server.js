const logger = require('./config/logger');
process.on('unhandledRejection', reason => {
  process.emit('uncaughtException', reason);
});

const { PORT, MONGO_CONNECTION_STRING } = require('./config/config');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');

const server = express();

server.use(cors());
server.use(express.json({ extended: true }));
server.use(express.urlencoded({ extended: true }));


async function start() {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    logger.info('Successfully connect to database');
    server.listen(PORT, () => logger.info(`Server is running on PORT ${PORT}`))
  } catch (error) {
    logger.error(`MongoDB Connection error: ${error.message}`)
  }

}

start()





