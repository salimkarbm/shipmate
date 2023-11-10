import { Logger, createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp: innerTimestamp }) => {
    return `${innerTimestamp}  ${level}: ${message}`;
});

interface ErrorLogFunction {
    (): Logger;
}

export const devErrorLog: ErrorLogFunction = () => {
    return createLogger({
        level: 'debug',
        format: combine(
            colorize(),
            timestamp({ format: 'HH:mm:ss' }),
            myFormat
        ),
        transports: [new transports.Console()]
    });
};

export const prodErrorLog: ErrorLogFunction = () => {
    return createLogger({
        level: 'info',
        format: combine(timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'error.log', level: 'error' })
        ]
    });
};
