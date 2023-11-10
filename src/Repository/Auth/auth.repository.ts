import { IUser } from '../../Models/Users/user.models';
import TABLE from '../../Models/index';
import { userRepository } from '../index';

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

    async UpdateOTP(payload: any): Promise<IUser | null> {
        const updatedPerson: any = await TABLE.USERS.query()
            .patch({
                OTP: payload.OTP,
                otpExpiresAt: payload.otpExpiresAt
            })
            .where({ email: payload.email });
        const user: IUser | null = await userRepository.findUserByEmail(
            payload.email
        );
        return updatedPerson ? (user as IUser) : null;
    }
}
