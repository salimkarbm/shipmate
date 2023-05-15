import { User, UserType } from '../../Models/user.model';
import { TABLE } from '../../Models/tables';
import { UpdatePassword } from '../../Models/user.model';

export default class UserRepository {
    async getAllRiders(user_type: string): Promise<UserType[]> {
        const user: UserType[] = (await User.query()
            .where('user_type', user_type)
            .page(1, 3)
            .then((rows) => rows)) as UserType[];
        return user;
    }
    async findUserById(id: string): Promise<UserType | null> {
        const user: any = await TABLE.USERS.query().where('id', id);
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }
    async updateUserPassword(body: UpdatePassword) {
        const updateUserPassword: any = await TABLE.USERS.query()
            .where('id', '=', body.id)
            .patch({
                password_digest: body.password,
            });
        const user: UserType | null = await this.findUserById(body.id);
        return updateUserPassword ? (user as any) : null;
    }
    async findUserByCodeAndEmail(
        email: string,
        verification_code: number | string
    ): Promise<null | UserType> {
        const user: any = await TABLE.USERS.query().where({
            email,
            verification_code,
        });
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }

    async findUserByEmail(email: string): Promise<null | UserType> {
        const user: any = await TABLE.USERS.query().where('email', email);
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }

    async findUserByPhoneNumber(phoneNumber: string): Promise<null | UserType> {
        const user: any = await TABLE.USERS.query().where(
            'phone_number',
            phoneNumber
        );
        if (user.length > 0) {
            return user[0];
        }
        return null;
    }
}
