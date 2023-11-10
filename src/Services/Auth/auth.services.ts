import { Request, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
import AppError from '../../Utils/Errors/appError';
import Utilities, { statusCode } from '../../Utils/helpers';
import { authRepository, userRepository } from '../../Repository/index';
import { MalierService } from '../Email/mailer';

const utils = new Utilities();
const mail = new MalierService();

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

        const emailData = await mail.sendOTP({
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
            return next(
                new AppError(
                    'Invalid OTP or OTP has expired',
                    statusCode.badRequest()
                )
            );
        }
        if (user === null) {
            return next(
                new AppError(
                    'Resource for user not found',
                    statusCode.notFound()
                )
            );
        }
        if (user.OTP !== Number(OTP)) {
            return next(new AppError('Invalid OTP', statusCode.unauthorized()));
        }
        if (user.isEmailVerified) {
            return next(
                new AppError(
                    'Email already verified',
                    statusCode.unauthorized()
                )
            );
        }

        const emailData = await mail.accountActivationMail({
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
}
