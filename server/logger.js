import { createLogger, format as _format, transports as _transports } from 'winston';

const customFormat = _format.combine(
  _format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  _format.align(),
  _format.errors({ stack: true }),
  _format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
);

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = createLogger({
  level: isDevelopment ? 'debug' : 'error',
  format: customFormat,
  transports: [
    new _transports.Console({
      handleExceptions: true
    }),
    new _transports.File({ filename: 'combined.log' })
  ]
});

// If we're not in production, also log to the console with colorization
if (isDevelopment) {
  logger.add(new _transports.Console({
    format: _format.combine(
      _format.colorize(),
      _format.simple()
    )
  }));
}

export default logger;