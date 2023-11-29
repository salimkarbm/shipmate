import { Request, NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import UserRepository from '../Repository/Users/user.repository';
import AppError from '../Utils/Errors/appError';
import Utilities, { statusCode } from '../Utils/helpers';

const userRepository = new UserRepository();
const util = new Utilities();

const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;
        if (!req.headers.authorization) {
            return res.status(statusCode.unauthorized()).json({
                message:
                    'please provide an authorization header to gain access',
                success: false
            });
        }
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(statusCode.unauthorized()).json({
                message: 'Invalid authorization header',
                success: false
            });
        }
        const decoded = (await util.verifyJWT(token)) as JwtPayload;
        if (decoded.expired === true) {
            return next(
                new AppError(
                    'Expired token please login',
                    statusCode.accessForbidden()
                )
            );
        }
        const currentUser = await userRepository.findUserById(
            decoded.payload.userId
        );
        if (!currentUser) {
            return res.status(statusCode.unauthorized()).json({
                message: 'the user belongs to the token no longer exist.',
                success: false
            });
        }
        req.user = currentUser;
        next();
    } catch (error) {
        return next(
            new AppError(
                `something went wrong here is the error ${error}`,
                statusCode.internalServerError()
            )
        );
    }
};

export default authenticate;
