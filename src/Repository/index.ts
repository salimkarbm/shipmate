import AuthRepository from './Auth/auth.repository';
import UserRepository from './Users/user.repository';

export const authRepository = new AuthRepository();
export const userRepository = new UserRepository();
