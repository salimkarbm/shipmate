import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../Utils/Errors/appError';
import logger from '../../Utils/Logger';
import { statusCode } from '../../Utils/HttpStatusCode/httpStatusCode';

dotenv.config({ path: './env' });

const sendErrorDev = (err: AppError | any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: AppError | any, res: Response) => {
    // operational error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            name: err.name,
            message: err.message
        });
        // programming or other unknown error: don't leak error details'
    } else {
        // 1) Log error
        logger.error('ERROR 💥', err);
        // send generic error message
        res.status(statusCode.internalServerError()).json({
            status: 'error',
            message:
                "something went wrong!, This wasn't supposed to happen Our engineers are working on it. How about a fresh start?"
        });
    }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
        const error = { ...err };
        if (error.name === 'ExpiredCodeException') {
            const { message } = error;
            const status = error.statusCode || 401;

            return res.status(status).json({
                success: false,
                message
            });
        }
        if (error.name === 'Error') {
            res.status(error.statusCode || 401);
            return res.json({
                success: false,
                message: error.message
            });
        }
        if (error.name === 'NotAuthorizedException') {
            const status = error.statusCode || 401;
            return res.status(status).json({
                success: false,
                error: error.message
            });
        }
        if (error.name === 'TokenExpiredError') {
            const status = error.statusCode || 401;
            return res.status(status).json({
                success: false,
                error: error.message
            });
        }
    } else {
        return res.status(err.statusCode || 400).json({
            success: false,
            error: err.message,
            message:
                "This wasn't supposed to happen Our engineers are working on it. How about a fresh start?"
        });
    }
};
