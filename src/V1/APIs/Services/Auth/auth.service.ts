import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { AppError } from '../../Utilities/Errors/appError';
import { UserType, User, refreshToken } from '../../Models/user.model';
import { response } from '../../Utilities/response';
import util from '../../Utilities/utils';
import Email from '../Email/mailer';
import AuthRepository from '../../Repository/auth/auth.repository';
import UserRepository from '../../Repository/User/userRepository';
import axios from 'axios';
import { utils } from '../../Utilities/utils';

const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const mail = new Email();

dotenv.config({ path: './src/V1/APIs/Config/.env' });

export default class AuthService {
    public googleAuthURL = async (
        req: Request,
        next: NextFunction
    ): Promise<void | string> => {
        const url = util.getGoogleAuthURL(req);
        if (!url) {
            throw next(new AppError('Could not get google url', 500));
        }
        return url;
    };
    public async googleAuth(req: Request, next: NextFunction) {
        const { name, email, picture, contact } = await util.getTokens(
            req,
            next
        );
        const userExist = await userRepository.findUserByEmail(email);
        if (userExist) {
            const { accessToken, refreshToken } =
                await util.generateAccessToken(userExist.email);
            await mail.sendWelcome({
                firstName: userExist.first_name,
                email: userExist.email,
                subject: 'Welcome to ShipMate',
            });
            return { accessToken, refreshToken, userExist };
        } else {
            const newName = name.split(' ');
            const data: UserType = {
                first_name: newName[0],
                last_name: newName[1],
                email: email,
                phone_number: 1233456789,
                password_digest: '',
                user_type: 'user',
                is_verified: true,
            };
            const newUser = await authRepository.createUser(data);
            const { accessToken, refreshToken } =
                await util.generateAccessToken(newUser.email);
            await mail.sendWelcome({
                firstName: data.first_name,
                email: data.email,
                subject: 'Welcome to ShipMate',
            });
            return { accessToken, refreshToken, newUser };
        }
    }

    public async facebookAuth(req: Request, next: NextFunction) {
        const { token } = req.body;
        const { data } = await axios.get(
            `https://graph.facebook.com/me?access_token=${token}&fields=name,email,id`
        );
        if (Object.keys(data).length === 0) {
            return next(
                new AppError('Invalid credentials, please try again.', 401)
            );
        }

        const name = data.name.split(' ');
        return (async () => {
            let newUser;
            const password = '';
            const hashPassword = await new utils().bcrypt(password);
            const user: any = {
                first_name: name[0],
                last_name: name[1],
                email: data.email,
                password_digest: hashPassword,
                phone_number: 123456789,
                user_type: 'User',
            };

            const userExist = await userRepository.findUserByEmail(user.email);
            if (!userExist) {
                newUser = await authRepository.createUser(user);
                const { accessToken, refreshToken } =
                    await util.generateAccessToken(newUser.email);
                await mail.sendWelcome({
                    firstName: newUser.first_name,
                    email: newUser.email,
                    subject: 'Welcome to ShipMate',
                });
                return { accessToken, refreshToken, newUser };
            } else if (userExist) {
                newUser = await userRepository.findUserByEmail(userExist.email);
                const { accessToken, refreshToken } =
                    await util.generateAccessToken(userExist.email);
                await mail.sendWelcome({
                    firstName: userExist.first_name,
                    email: userExist.email,
                    subject: 'Welcome to ShipMate',
                });
                return { accessToken, refreshToken, newUser };
            }
        })();
    }

    public async registerUser(
        req: Request,
        next: NextFunction
    ): Promise<UserType | void> {
        const { firstName, lastName, password, userType, phoneNumber, email } =
            req.body;

        const code = crypto.randomInt(100000, 1000000);
        const user = {
            first_name: firstName,
            last_name: lastName,
            password_digest: password,
            phone_number: phoneNumber,
            email,
            verification_code: code,
            user_type: userType,
        };
        const userEmail = await userRepository.findUserByEmail(user.email);

        if (userEmail) {
            throw next(new AppError('Email is already taken', 400));
        }

        const userPhone = await userRepository.findUserByEmail(
            user.phone_number
        );

        if (userPhone) {
            throw next(new AppError('Phone number is already taken', 400));
        }
        if (userEmail === null && userPhone === null) {
            const registerUser: UserType = await authRepository.createUser(
                user
            );
            if (!registerUser) {
                throw next(new AppError('Unable to create user', 400));
            }
            if (registerUser) {
                const userInfo = {
                    firstName: registerUser.first_name,
                    email: registerUser.email,
                    subject: 'Verify your ShipMate Account',
                    code: Number(registerUser.verification_code),
                };
                await mail.sendOTP(userInfo);
                return registerUser;
            }
        }
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const usercheck = await userRepository.findUserByEmail(email);
        if (!usercheck) {
            throw next(new AppError('Incorrect Email or password', 400));
        }
        if (!usercheck.is_verified) {
            throw next(
                new AppError(
                    'User account is not active, Kindly activate account',
                    422
                )
            );
        }
        const user = await authRepository.authenticate(email, password);
        if (user) {
            const { accessToken, refreshToken } =
                await util.generateAccessToken(user[0].email);
            const userInfo = {
                firstName: user[0].first_name,
                email: user[0].email,
                subject: 'Login Notification',
            };
            const profile = {
                email: user[0].email,
                firstName: user[0].first_name,
                lastName: user[0].last_name,
                userType: user[0].user_type,
                expiresIn: 1800,
                token: {
                    accessToken,
                    refreshToken,
                },
            };
            res.setHeader('Set-Cookie', refreshToken);
            res.cookie('token', refreshToken, {
                expires: new Date(Date.now() + 1800),
            });
            await mail.sendLoginConfirmation(userInfo);
            return profile;
        } else {
            throw next(new AppError('Incorrect password', 403));
        }
    }

    public async activateAccount(req: Request, next: NextFunction) {
        const { code, email } = req.body;

        const user: any = await userRepository.findUserByCodeAndEmail(
            email,
            code
        );
        if (!user) {
            throw next(new AppError('Resource for user not found', 404));
        }

        if (user.is_verified) {
            throw next(new AppError('Email already verified', 409));
        }
        const modifyUser: false | UserType[] | User[] =
            await authRepository.activateAccount({ code, email });
        if (modifyUser) {
            const userInfo = {
                firstName: user.first_name,
                email: user.email,
                subject: 'Welcome to ShipMate',
            };
            return await mail.sendWelcome(userInfo);
        }
    }

    public async forgotPassword(req: Request, next: NextFunction) {
        const { email } = req.body;
        const code = crypto.randomInt(100000, 1000000);
        const userEmail = await userRepository.findUserByEmail(email);

        if (!userEmail) {
            throw next(
                new AppError(`User with email: ${email} not found`, 404)
            );
        }
        const user: false | UserType[] = await authRepository.forgotPassword({
            code,
            email,
        });

        if (!user) {
            throw next(new AppError(`Forgot Password Failed`, 400));
        }
        const data = {
            email,
            firstName: user[0].first_name,
            code: user[0].verification_code,
            subject: 'ShipMate Password Reset Sent',
        };

        return await mail.sendForgotPassword(data);
    }

    public async resetPassword(req: Request, next: NextFunction) {
        const { password, confirmPassword, code, email } = req.body;
        const newPassword =
            password === confirmPassword
                ? password
                : next(new AppError(`password doesn't match`, 400));

        const userExist = await userRepository.findUserByEmail(email);

        if (!userExist) {
            throw next(
                new AppError(`User with email: ${email} not found`, 404)
            );
        }
        const confirmCode = await userRepository.findUserByCodeAndEmail(
            email,
            code
        );

        if (!confirmCode) {
            throw next(new AppError(`Please provide a valide code`, 404));
        }
        const userData = { newPassword, code, email };
        const resetUser: UserType[] | false = await authRepository.resetUser(
            userData
        );

        if (!resetUser) {
            throw next(
                new AppError(
                    `Password for user with email ${email} not updated`,
                    400
                )
            );
        }
        const data = {
            email: email,
            firstName: resetUser[0].first_name,
            subject: 'Password Reset Successfully',
        };
        await mail.sendResetSuccess(data);
    }

    public async refreshToken(body: refreshToken, next: NextFunction) {
        const user = await userRepository.findUserByEmail(body.email);
        if (!user) {
            return next(new AppError('user with this email not found', 404));
        }
        const isValid = await util.verifyRefreshToken(
            body.email,
            body.refreshToken
        );
        if (isValid) {
            let { accessToken, refreshToken } = await util.generateAccessToken(
                body.email
            );
            return { accessToken, refreshToken, user };
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        res.clearCookie('token');
        res.removeHeader('Set-Cookie');
        res.status(200).json(response({ message: 'Logout Successfully' }));
    }
}
