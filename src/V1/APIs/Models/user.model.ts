import { Model } from 'objection';

export interface UserType {
    id?: number;
    first_name: string;
    last_name: string;
    password_digest: string;
    phone_number: number;
    email: string;
    verification_code?: number;
    is_verified?: boolean;
    created_at?: string;
    user_type: string;
    is_active?: boolean;
    long_lat?: number;
}
export interface editUserProfile {
    first_name: string;
    last_name: string;
    email: string;
    state: string;
    country: string;
    zip_code: string;
    id: string;
    currentPassword: string;
    newPassword: string;
    photo: string;
}
export interface ChangePassword {
    currentPassword: string;
    password: string;
    id: string;
}
export interface refreshToken {
    email: string;
    refreshToken: string;
}

export interface UpdatePassword {
    password: string;
    id: string;
}

export interface DeleteUser {
    isActive: string;
    userId: string;
}
export class User extends Model {
    static get tableName() {
        return 'users';
    }
}
