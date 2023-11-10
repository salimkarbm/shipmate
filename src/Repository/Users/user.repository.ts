import { IUser } from '../../Models/Users/user.models';
import TABLE from '../../Models/index';

export default class UserRepository {
    async findUserById(userId: string): Promise<IUser | null> {
        const user: any = await TABLE.USERS.query().where('userId', userId);
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }

    async findUserByCodeAndEmail(
        email: string,
        OTP: number | string
    ): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query().where({ email, OTP });
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }

    async findUserByEmail(email: string): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query().where('email', email);
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }

    async findUsers(): Promise<IUser[]> {
        const users = await TABLE.USERS.query().select('*');
        return users as any;
    }
}
