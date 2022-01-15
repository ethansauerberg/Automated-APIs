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
          new Winston.transports.File({ filename: Constants.allLogFile}),
          new Winston.transports.File({ filename: Constants.warnLogFile, level: 'warn'}),
          new Winston.transports.File({ filename: Constants.errorLogFile, level: 'error'}),
          new Winston.transports.File({ filename: Constants.alertLogFile, level: 'alert'}),

        ]
    });
})();

module.exports = logger;
