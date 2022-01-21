// import { createLogger, format, transports } from 'winston';

// // Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
// const logger = createLogger({
//   // To see more detailed errors, change this to 'debug'
//   level: 'info',
//   format: format.combine(
//     format.splat(),
//     format.simple()
//   ),
//   transports: [
//     new transports.Console()
//   ],
// });

const logger = {
  log(...args: any[]) {
    console.log(...args);
  },
  info(...args: any[]) {
    console.info(...args);
  },
  warn(...args: any[]) {
    console.warn(...args);
  },
  error(...args: any[]) {
    console.error(...args);
  },
};

export default logger;
