import { utils } from '../../Utilities/utils';
import { User, UserType } from '../../Models/user.model';
import crypto from 'crypto';

const RandomeCode = crypto.randomInt(100000, 1000000);
export default class AuthRepository {
    async createUser(user: UserType): Promise<UserType> {
        const hashPassword = await new utils().bcrypt(user.password_digest);
        const newUser: any = await User.query().insert({
            first_name: user.first_name,
            last_name: user.last_name,
            password_digest: hashPassword,
            phone_number: user.phone_number,
            email: user.email,
            verification_code: user.verification_code,
            user_type: user.user_type,
        });
        return newUser;
    }

    async authenticate(
        email: string,
        password: string
    ): Promise<UserType[] | undefined> {
        const user: any = await User.query().where('email', email);
        const checkPassword = await new utils().compare(
            password,
            user[0].password_digest
        );
        if (!checkPassword) {
            return undefined;
        }
        return user;
    }

    async resetUser(userData: {
        newPassword: string;
        email: string;
    }): Promise<UserType[] | false> {
        const user: any = await User.query().where('email', userData.email);

        const hashPassword = await new utils().bcrypt(userData.newPassword);

        const updateUserPassword: any = await User.query()
            .where('email', userData.email)
            .patch({
                password_digest: hashPassword,
                verification_code: RandomeCode,
            });

        let newUser: UserType[] | false = updateUserPassword ? user : false;

        return newUser as any;
    }

    async forgotPassword(userData: {
        code: string | number;
        email: string;
    }): Promise<UserType[] | false> {
        const updateUserCode = await User.query()
            .patch({ verification_code: userData.code })
            .where('email', userData.email);

        const user: any = await User.query().where('email', userData.email);

        return updateUserCode ? user : false;
    }

    async activateAccount(userData: {
        code: string | number;
        email: string;
    }): Promise<UserType[] | User[] | false> {
        const userUpdate: number = await User.query()
            .patch({
                is_verified: 'true',
                verification_code: RandomeCode,
            })
            .where('verification_code', userData.code);

        const user: UserType[] | User[] = await User.query().where(
            'email',
            userData.email
        );

        return userUpdate ? user : false;
    }
}
