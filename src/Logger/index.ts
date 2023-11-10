import { Logger, createLogger } from 'winston';
import { devErrorLog, prodErrorLog } from './errorLogger';

let logger: Logger = createLogger();

if (process.env.NODE_ENV === 'development') {
    logger = devErrorLog();
}

if (process.env.NODE_ENV === 'production') {
    logger = prodErrorLog();
}

export default logger;
