import 'dotenv/config';

import { NextFunction, Request, Response } from 'express';

import AppError from '../../Utils/Errors/appError';

export const sendErrorDev = (err: AppError, res: Response) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: err.statusCode,
        message: err.message,
        error: err,
        stack: err.stack,
        name: err.name
    });
};

export const sendErrorProd = (err: AppError, res: Response) => {
    const statusCode = err.statusCode || 500;
    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            message: err.message,
            name: err.name,
            operation: err.isOperational
        });
    }
};

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.ENV === 'development') {
        sendErrorDev(err, res);
    }
    if (process.env.ENV === 'production') {
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
