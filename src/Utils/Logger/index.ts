import 'dotenv/config';
import { Logger, createLogger } from 'winston';
import { devErrorLog, prodErrorLog } from './errorLogger';

const { NODE_ENV } = process.env;

let logger: Logger = createLogger();

if (NODE_ENV === 'development') {
    logger = devErrorLog();
}

if (NODE_ENV === 'production') {
    logger = prodErrorLog();
}

export default logger;
