import { Model } from 'objection';
import { Car, ICar } from '../Cars/car.model';
import { Wallet } from '../Wallets/wallet.model';
// import { Item } from '../Deliveries/delivery.model';
// import { Trip } from '../Trips/trip.model';

export interface IUser {
    userId?: string;
    passwordDigest: string;
    email: string;
    confirmPassword?: string;
    firstName: string;
    otherName?: string;
    lastName: string;
    OTP: number | string;
    isEmailVerified?: boolean;
    createdAt?: string;
    isActive?: boolean;
    role?: string;
    gender?: string;
    isProfileComplete?: string;
    phoneNumber: string;
    NIN?: string;
    bio?: string;
    address?: string;
    passwordResetOtp?: string | number;
    profilePictureId?: string;
    profilePicture?: string;
    otpExpiresAt?: number;
    readonly length?: number;
    location?: string;
    userType?: string;
    facebookId?: string;
}

export interface IUpdateOTP {
    OTP: number | number;
    otpExpiresAt: number | string;
    email: string;
}

export interface IProfile extends IUser {
    cars: [ICar];
}

export class User extends Model {
    static get tableName() {
        return 'users';
    }

    static relationMappings = {
        cars: {
            relation: Model.HasManyRelation,
            modelClass: Car,
            join: {
                from: 'users.userId',
                to: 'cars.userId'
            }
        },
        wallets: {
            relation: Model.HasManyRelation,
            modelClass: Wallet,
            join: {
                from: 'users.userId',
                to: 'wallets.userId'
            }
        }
        // trips: {
        //     relation: Model.HasManyRelation,
        //     modelClass: Trip,
        //     join: {
        //         from: 'users.userId',
        //         to: 'trips.userId'
        //     }
        // },
        // items: {
        //     relation: Model.HasManyRelation,
        //     modelClass: Item,
        //     join: {
        //         from: 'users.userId',
        //         to: 'items.userId'
        //     }
        // }
    };
}
