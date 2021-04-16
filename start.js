const mongoose = require('mongoose');

async function start(mongoUri, mongoConfig, port, loggers, app) {
  try {
    await mongoose.connect(mongoUri, mongoConfig);

    const { dbInfo, serverInfo } = loggers(port);

    dbInfo && dbInfo();
    app.listen(port, serverInfo && serverInfo());
  } catch (error) {
    const { errorInfo } = loggers;
    errorInfo && errorInfo(error);
  }
}

module.exports = start;
