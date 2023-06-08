import { Request, Response, NextFunction } from 'express';
import AuthService from '../../Services/Auth/auth.service';
import { AppError } from '../../Utilities/Errors/appError';
import { response } from '../../Utilities/response';
const authService = new AuthService();

export const googleAuthURL = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const url: any = await authService.googleAuthURL(req, next);
        if (url) {
            return res.status(201).json({
                status: 'success',
                message: 'Google Authentication URL Sent',
                url,
            });
        }
    } catch (err) {
        return next(
            new AppError(`something went wrong here is the error ${err}`, 500)
        );
    }
};

export const googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: any = await authService.googleAuth(req, next);
        if (user) {
            return res.status(201).json({
                status: 'success',
                message: 'User successfully login.',
            });
        }
    } catch (err) {
        return next(
            new AppError(`something went wrong here is the error ${err}`, 500)
        );
    }
};

export const facebookAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user: any = await authService.facebookAuth(req, next);
        if (user) {
            return res.status(201).json({
                status: 'success',
                message: 'User successfully login.',
            });
        }
    } catch (err) {
        return next(
            new AppError(`something went wrong here is the error ${err}`, 500)
        );
    }
};

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await authService.registerUser(req, next);
        return res.status(201).json({
            success: true,
            message:
                'Account successfully created, Check your mail for activation code',
        });
    } catch (error) {
        throw next(new AppError(`something went wrong ${error}`, 500));
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const profile = await authService.login(req, res, next);
        res.status(200).json(
            response({ message: 'Login Successful', data: profile })
        );
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export const activateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.activateAccount(req, next);
        res.status(200).json({
            success: true,
            message: 'Email verification successful',
        });
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.forgotPassword(req, next);
        res.status(200).json(
            response({
                success: true,
                message: 'Password Reset Sent',
            })
        );
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export const verifyRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, refreshToken } = req.body;
        const payload = { email, refreshToken };
        const verifiedToken = await authService.refreshToken(payload, next);
        if (verifiedToken) {
            return res.status(200).json({
                success: true,
                accessToken: verifiedToken.accessToken,
                refreshToken: verifiedToken.refreshToken,
                user: verifiedToken.user,
                message: 'refresh token verification successful',
            });
        } else {
            return res.status(401).json({
                success: false,
                error: 'Invalid token,try login again',
            });
        }
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.resetPassword(req, next);
        res.status(200).json(
            response({
                success: true,
                message: 'Password successfully reset',
            })
        );
    } catch (error) {
        return next(
            new AppError(`something went wrong here is the error ${error}`, 500)
        );
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return await authService.logout(req, res, next);
};
