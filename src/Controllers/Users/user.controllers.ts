import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
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
        logger.error(err);
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
        logger.error(err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};
