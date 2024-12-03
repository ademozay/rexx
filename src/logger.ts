import { createLogger, format, transports } from 'winston';

let outputFormat = format.combine(
  format.errors({ stack: true }),
  format.colorize(),
  format.simple(),
);

if (process.env.NODE_ENV === 'production') {
  outputFormat = format.json();
}

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: outputFormat,
      level: process.env.LOG_LEVEL,
    }),
  ],
});
