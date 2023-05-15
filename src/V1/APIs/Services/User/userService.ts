import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { User, UserType } from '../../Models/user.model';
import UserRepository from '../../Repository/User/userRepository';
import { response } from '../../Utilities/response';

const UserStatType = new UserRepository();

export default class UserService {
    // Here is the logic to get order by id
    public async getAllRiders(req: Request, res: Response, next: NextFunction) {
        try {
            const { userType } = req.params;
            //Find userType
            const user: UserType[] = await UserStatType.getAllRiders(userType);

            //Return status 200 if found
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }
}
