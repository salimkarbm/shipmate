import { Model } from 'objection';

export interface IUser {
    userId: string;
    passwordDigest: string;
    email: string;
    confirmPassword?: string;
    firstName: string;
    lastName: string;
    OTP: number | string;
    isEmailVerified?: boolean;
    createdAt?: string;
    isActive?: boolean;
    role?: string;
    isProfileComplete?: string;
    phoneNumber: string;
    bio?: string;
    address?: string;
    passwordResetOtp?: string | number;
    profilePictureId?: string;
    profilePicture?: string;
    otpExpiresAt?: number;
    readonly length?: number;
    location?: string;
    userType?: string;
}

export interface IUpdateOTP {
    OTP: number | number;
    otpExpiresAt: number | string;
    email: string;
    passwordResetOTP?: number | string;
}

export class User extends Model {
    static get tableName() {
        return 'users';
    }
}
