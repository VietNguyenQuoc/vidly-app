const winston = require('winston');

module.exports = function() {
  winston.exceptions.handle(new winston.transports.File({ filename: 'exception.log' }));
  process.on('unhandledRejection', (ex) => {
    throw (ex);
  });
}