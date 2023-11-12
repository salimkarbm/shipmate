import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
import AppError from '../../Utils/Errors/appError';
import Utilities, { statusCode } from '../../Utils/helpers';
import { authRepository, userRepository } from '../../Repository/index';
import { MalierService } from '../../Utils/Email/mailer';

const utils = new Utilities();
const emailNotification = new MalierService();

export default class AuthService {
    public async signUp(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const {
            firstName,
            lastName,
            password,
            email,
            phoneNumber,
            confirmPassword
        } = req.body;
        if (password !== confirmPassword) {
            throw next(
                new AppError('password do not match', statusCode.badRequest())
            );
        }
        const isUser: IUser | null =
            await userRepository.findUserByEmail(email);
        if (isUser) {
            throw next(
                new AppError(
                    'User with this Email address already exist',
                    statusCode.conflict()
                )
            );
        }
        const hashPassword = await utils.generateHash(password);
        const { OTP, otpExpiresAt } = await utils.generateOtpCode();

        const user: IUser = {
            userId: utils.generateUUID(),
            firstName,
            lastName,
            email,
            phoneNumber,
            passwordDigest: hashPassword,
            OTP,
            otpExpiresAt
        };

        const emailData = await emailNotification.sendOTP({
            email,
            subject: 'Shipmate Email Verification',
            OTP
        });
        if (emailData.accepted[0] === email) {
            const newUser = await authRepository.signUp(user);
            return newUser as IUser;
        }
        throw next(
            new AppError('Email not sent', statusCode.serviceUnavalaibleError())
        );
    }

    public async activateUserAccount(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { OTP, email } = req.body;
        const user: IUser | null = await userRepository.findUserByCodeAndEmail(
            email,
            OTP as number
        );
        if (
            user?.otpExpiresAt !== undefined &&
            Date.now() > user?.otpExpiresAt
        ) {
            throw next(
                new AppError(
                    'Invalid OTP or OTP has expired',
                    statusCode.badRequest()
                )
            );
        }
        if (user === null) {
            throw next(
                new AppError(
                    'Resource for user not found',
                    statusCode.notFound()
                )
            );
        }
        if (user.OTP !== Number(OTP)) {
            throw next(new AppError('Invalid OTP', statusCode.unauthorized()));
        }
        if (user.isEmailVerified) {
            throw next(
                new AppError(
                    'Email already verified',
                    statusCode.unauthorized()
                )
            );
        }

        const emailData = await emailNotification.accountActivationMail({
            email: user.email,
            subject: 'Shipmate Email Activation'
        });
        if (emailData.accepted[0] === user.email) {
            await authRepository.activateUserAccount(user.userId);
            return user;
        }
        throw next(
            new AppError('Email not sent', statusCode.serviceUnavalaibleError())
        );
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            throw next(
                new AppError(
                    'Incorrect Email or password',
                    statusCode.notFound()
                )
            );
        }
        if (!user.isEmailVerified) {
            throw next(
                new AppError(
                    'User account is not active, Kindly activate account',
                    statusCode.unprocessableEntity()
                )
            );
        }
        if (user) {
            const checkPassword = await utils.comparePassword(
                password,
                user.passwordDigest
            );
            if (checkPassword) {
                /*
                  send a mail to the user email on successful login attempt
                */
                const { accessToken, refreshToken } = await utils.generateToken(
                    user.email
                );
                if (accessToken && refreshToken) {
                    res.cookie('jwt', refreshToken, {
                        maxAge: 24 * 60 * 60 * 1000,
                        httpOnly: true
                    });
                }
                user.passwordResetOtp = 'undefine';
                user.passwordDigest = 'undefine';
                user.OTP = 'undefine';
                return {
                    accessToken,
                    refreshToken,
                    data: {
                        user
                    }
                };
            }
        }
    }

    public async resendOTP(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { email } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return next(new AppError('User not found', statusCode.notFound()));
        }
        const { OTP, otpExpiresAt } = await utils.generateOtpCode();
        const payload = {
            email,
            OTP,
            otpExpiresAt
        };

        const emailData = await emailNotification.sendOTP({
            email,
            subject: 'OTP Verification Code',
            OTP
        });
        if (emailData.accepted[0] === user.email) {
            const response = await authRepository.UpdateOTP(payload);
            return response as IUser;
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        const email = req.headers['x-user-email'] as string;
        const token = req.headers['x-user-token'] as string;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return next(
                new AppError(
                    'User with this email not found',
                    statusCode.notFound()
                )
            );
        }
        const isValid = await utils.verifyToken(email, token);
        if (isValid) {
            const { accessToken, refreshToken } =
                await utils.generateToken(email);
            user.OTP = 'undefined';
            user.passwordDigest = 'undefined';
            user.passwordResetOtp = 'undefine';
            return res.status(200).json({
                accessToken,
                refreshToken,
                data: user
            });
        }
        return next(
            new AppError(
                'Invalid token. Please login to gain access',
                statusCode.unauthorized()
            )
        );
    }

    public async forgotPassword(req: Request, next: NextFunction) {
        const { email } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return next(new AppError('User not found', statusCode.notFound()));
        }
        const { OTP, otpExpiresAt } = await utils.generateOtpCode();

        // send mail
        const emailData = await emailNotification.forgotPasswordMail({
            email: user.email,
            OTP,
            firstName: user.firstName,
            subject: 'Forgot Password Notification'
        });
        if (emailData.accepted[0] === user.email) {
            await authRepository.UpdateOTP({
                email,
                OTP,
                otpExpiresAt
            });
            return user;
        }
        throw next(
            new AppError(
                'Notification failed, try again later',
                statusCode.noContent()
            )
        );
    }
}
