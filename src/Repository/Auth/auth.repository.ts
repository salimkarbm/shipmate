import { IUser, IUpdateOTP } from '../../Models/Users/user.model';
import TABLE from '../../Models/index';
import { userRepository } from '../index';
import { util } from '../../Utils/helpers';

export default class AuthRepository {
    async signUp(payload: IUser): Promise<IUser> {
        const user: any = await TABLE.USERS.query().insert(payload);
        return user as IUser;
    }

    async activateUserAccount(userId: string): Promise<IUser | null> {
        const updatedPerson: any = await TABLE.USERS.query()
            .patch({
                isEmailVerified: 'true'
            })
            .where({ userId });
        const user: IUser | null = await userRepository.findUserById(userId);
        return updatedPerson ? (user as IUser) : null;
    }

    async UpdateOTP(payload: IUpdateOTP): Promise<IUser | null> {
        const updatedPerson: any = await TABLE.USERS.query()
            .patch({
                OTP: payload.OTP,
                otpExpiresAt: payload.otpExpiresAt
            })
            .returning('*')
            .where({ email: payload.email });
        const user: IUser | null = await userRepository.findUserByEmail(
            payload.email
        );
        return updatedPerson ? (user as IUser) : null;
    }

    async resetPassword(
        email: string,
        newPassword: string
    ): Promise<IUser | null> {
        const hashPassword = await util.generateHash(newPassword);
        const updatedPerson: any = await TABLE.USERS.query()
            .patch({
                passwordDigest: hashPassword
            })
            .where({ email })
            .returning('*');

        const user: IUser | null = await userRepository.findUserByEmail(email);
        return updatedPerson ? (user as IUser) : null;
    }
}
