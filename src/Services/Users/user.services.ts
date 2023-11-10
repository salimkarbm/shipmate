import { Request, NextFunction } from 'express';
import { IUser } from '../../Models/Users/user.models';
// import AppError from '../../Utils/Errors/appError';
// import Utilities, { statusCode } from '../../Utils/helpers';
import { userRepository } from '../../Repository/index';
import AppError from '../../Utils/Errors/appError';
import { statusCode } from '../../Utils/helpers';
// import { MalierService } from '../Email/mailer';

// const utils = new Utilities();
// const mail = new MalierService();

export default class UserService {
    public async findUsers(
        req: Request,
        next: NextFunction
    ): Promise<IUser[] | void> {
        const users = await userRepository.findUsers();
        return users as IUser[];
    }

    public async findUser(
        req: Request,
        next: NextFunction
    ): Promise<IUser | void> {
        const { userId } = req.params;
        const user = await userRepository.findUserById(userId);
        if (user) {
            return user as IUser;
        }
        throw next(new AppError('User not found', statusCode.notFound()));
    }
}
