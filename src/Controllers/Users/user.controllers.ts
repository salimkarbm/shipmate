import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.model';
import AppError from '../../Utils/Errors/appError';
import { userService } from '../../Services/index';
import { statusCode } from '../../Utils/helpers';
import logger from '../../Utils/Logger';

export const findUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser[] | void = await userService.findUsers(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Users Fetch successfully',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error('unable to find users', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser | void = await userService.findUser(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'User Fetch successfully',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error('unable to find user', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const changeUserEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser | void = await userService.changeUserEmail(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Email updated successfully',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error('Unable to update user Email', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const changeUserPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser | void = await userService.changeUserPassword(
            req,
            next
        );
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Password changed successfully',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error('Unable to change user password', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: IUser | void = await userService.updateMe(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user
            }
        });
    } catch (err) {
        logger.error('Unable to update user profile', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const addCar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const car = await userService.addCar(req, next);
        return res.status(statusCode.created()).json({
            status: 'success',
            message: 'Car added successfully',
            data: car
        });
    } catch (err) {
        logger.error('unable to add car', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const viewUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const profile = await userService.viewProfile(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Profile Fetch successfully',
            data: profile
        });
    } catch (err) {
        logger.error('unable fetch user profile', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};
