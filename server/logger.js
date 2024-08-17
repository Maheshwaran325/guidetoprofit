import { createLogger, format as _format, transports as _transports } from 'winston';

const customFormat = _format.combine(
  _format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  _format.align(),
  _format.errors({ stack: true }),
  _format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: customFormat,
  transports: [
    new _transports.Console({
      handleExceptions: true
    }),
    new _transports.File({ filename: 'combined.log' })
  ]
});

export default logger;