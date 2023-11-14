import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
import AppError from '../../Utils/Errors/appError';
import { authService } from '../../Services/index';
import { statusCode } from '../../Utils/helpers';
import logger from '../../Utils/Logger';

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser | void = await authService.signUp(req, next);
        return res.status(statusCode.created()).json({
            status: 'success',
            message:
                'Account successfully created, Check your mail for activation code',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const activateUserAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.activateUserAccount(req, next);
        if (user) {
            return res.status(statusCode.accepted()).json({
                success: true,
                message:
                    'Email verification successful, please login to continue'
            });
        }
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await authService.login(req, res, next);
        res.status(statusCode.accepted()).json({
            success: true,
            message: 'Login successful',
            response
        });
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const resendOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.resendOTP(req, next);
        return res.status(statusCode.ok()).json({
            success: true,
            message: 'OTP sent successful, please check your email'
        });
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const verifiedToken = await authService.refreshToken(req, res, next);
        return verifiedToken;
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await authService.forgotPassword(req, next);
        if (response) {
            return res.status(statusCode.accepted()).json({
                success: true,
                message:
                    'A passowrd reset code has been sent to your email Successfully.'
            });
        }
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await authService.resetPassword(req, next);
        if (response) {
            return res.status(statusCode.ok()).json({
                success: true,
                message: 'Password reset successfully'
            });
        }
    } catch (err) {
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};
