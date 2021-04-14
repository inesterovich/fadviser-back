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
const app = express();



app.use(helmet());

const corsOptions = {
  methods: 'GET, POST'
}
app.use(cors(corsOptions));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
/*
По факту, я смогу попробовать посмотреть, что происходит с типичными запросами, когда сделаю доку для них
*/
/* App routes */
app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running');
    return;
  }
  next();
})


app.use('/users', userRouter);

app.use((req, res, next) => next(createError(NOT_FOUND)) )


app.use(errorHandler);
/*
const all_routes = require('express-list-endpoints');
console.log(all_routes(server));
*/

/*



*/

module.exports = app;




