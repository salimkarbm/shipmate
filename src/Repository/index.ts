import AuthRepository from './Auth/auth.repository';
import UserRepository from './Users/user.repository';
import TripRepository from './Trips/trip.repository';

export const authRepository = new AuthRepository();
export const userRepository = new UserRepository();
export const tripRepository = new TripRepository();
