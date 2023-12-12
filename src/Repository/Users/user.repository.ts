import { IProfile, IUser } from '../../Models/Users/user.model';
import { ICar } from '../../Models/Cars/car.model';
import TABLE from '../../Models/index';

export default class UserRepository {
    async findUserById(userId: string): Promise<IUser | null> {
        const user: any = await TABLE.USERS.query()
            .where('userId', userId)
            .withGraphFetched('cars');
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
        const users = await TABLE.USERS.query()
            .select('*')
            .withGraphFetched('cars');
        return users as any;
    }

    async updateUser(payload: IUser, userId: string): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query()
            .where('userId', '=', userId)
            .update(payload)
            .returning('*');
        return user[0] as IUser;
    }

    async updateIsProfileCompleteToTrue(userId: string): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query()
            .where('userId', '=', userId)
            .update({ isProfileComplete: true })
            .returning('*');
        return user[0] as IUser;
    }

    async updateUserEmail(
        payload: string,
        userId: string
    ): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query()

            .where('userId', '=', userId)
            .update(payload)
            .returning('*');
        return user[0] as IUser;
    }

    async updateUserPassword(
        payload: string,
        userId: string
    ): Promise<null | IUser> {
        const user: any = await TABLE.USERS.query()

            .where('userId', '=', userId)
            .update({ passwordDigest: payload })
            .returning('*');
        return user[0] as IUser;
    }

    async addCar(payload: ICar): Promise<ICar> {
        const car: any = await TABLE.CARS.query().insert(payload);
        return car as ICar;
    }

    async viewProfile(userId: string): Promise<IProfile | null> {
        const user: any = await TABLE.USERS.query()
            .where('userId', userId)
            .withGraphFetched('cars');
        return user[0];
    }

    async findCarById(carId: string): Promise<ICar | null> {
        const car: any = await TABLE.CARS.query().where('userId', carId);
        if (car.length > 0) {
            return car[0];
        }
        return null;
    }
}
