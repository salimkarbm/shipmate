import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../Utilities/Errors/appError';
import { User, UserType } from '../Models/user.model';

export interface jwtToken {
    user_id: number;
    iat: number;
    exp: number;
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;
        if (!req.headers.authorization) {
            return res.status(401).json({
                message:
                    'please provide an authorization header to gain access',
                success: false,
            });
        }
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                message: 'Invalid authorization header',
                success: false,
            });
        }
        const decoded = jwt.verify(
            token,
            String(process.env.AccessToken)
        ) as jwtToken;
        if (!decoded) {
            return next(new AppError('Invalid authorization token', 401));
        }
        const currentUser: any = await User.query().findById(
            decoded.user_id as number
        );
        if (!currentUser) {
            return res.status(401).json({
                message: 'the user belongs to the token no longer exist.',
                success: false,
            });
        }
        req.user = currentUser as UserType;
        next();
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};
