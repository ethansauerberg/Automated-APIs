const Winston = require('winston');
const Constants = require('../constants.js')

var logger;

(function createLogger() {
    logger = Winston.createLogger({
        format: Winston.format.combine(
          Winston.format.timestamp(),
          Winston.format.json(),
        ),
        transports: [
          //The various log files, of increasing levels of concern. 
          new Winston.transports.File({ filename: Constants.allLogFile}), //all logs 
          new Winston.transports.File({ filename: Constants.warnLogFile, level: 'warn'}), //only logs where either a user did something wrong or a server error/attack occurred
          new Winston.transports.File({ filename: Constants.errorLogFile, level: 'error'}), //only logs where a server error/attack occurred
          new Winston.transports.File({ filename: Constants.alertLogFile, level: 'alert'}), //only logs where a server attack occurred

        ]
    });
})();

module.exports = logger;
