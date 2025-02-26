const { createLogger, format, transports } = require('winston');

// Define custom logging format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

// Create logger instance
const logger = createLogger({
  level: 'info',  // default log level
  format: logFormat,
  transports: [
    // Log to console
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    // Log to a file
    new transports.File({
      filename: 'logs/app.log',
      level: 'info',  // You can set the file logging level to 'info' or 'error'
    })
  ],
});

// Add a catch-all for uncaught exceptions and unhandled promise rejections
logger.exceptions.handle(
  new transports.Console({ format: logFormat }),
  new transports.File({ filename: 'logs/exceptions.log' })
);

process.on('unhandledRejection', (ex) => {
  throw ex; // this will be caught by `exceptions.handle`
});

// Export the logger
module.exports = { logger };