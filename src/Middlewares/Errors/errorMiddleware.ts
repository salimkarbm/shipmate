import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/Errors/appError';
import { statusCode } from '../../Utils/helpers';

const handleDuplicateDBField = (err: AppError | any) => {
    const message = err.detail;
    return new AppError(message, statusCode.notFound());
};

const handleExpressValidatorError = (err: AppError | any) => {
    const errors = err.errors.map((el: any) => {
        const result = Object.values(el);
        return result[2];
    });
    const message = `Invalid input data ${errors.join(', ')}.`;
    return new AppError(message, statusCode.notFound());
};

const handleJWTError = () => {
    return new AppError(
        'Invalid token. please log in again ',
        statusCode.unauthorized()
    );
};

const handleJWTExpiredError = () => {
    return new AppError(
        'Your token has expired! please log in again',
        statusCode.unauthorized()
    );
};

const sendErrorDev = (err: AppError | any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorPro = (err: AppError | any, res: Response) => {
    // operational error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // programming or other unknown error: don't leak error details'
    } else {
        // log error
        console.error('ERROR', err);
        // send generic error message
        res.status(statusCode.internalServerError()).json({
            status: 'error',
            message:
                "something went wrong!, This wasn't supposed to happen Our engineers are working on it. How about a fresh start?"
        });
    }
};

export default (
    err: AppError | any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (error.errors instanceof Array) {
            error = handleExpressValidatorError(error);
        }
        if (error.code === 23505) {
            error = handleDuplicateDBField(error);
        }
        sendErrorPro(error, res);
    }
};
