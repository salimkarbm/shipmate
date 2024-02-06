import AuthRepository from './Auth/auth.repository';
import UserRepository from './Users/user.repository';
import TripRepository from './Trips/trip.repository';
import DeliveryItemRepository from './Deliveries/delivery.repository';
import WalletRepository from './Wallets/wallet.repository';

export const authRepository = new AuthRepository();
export const userRepository = new UserRepository();
export const tripRepository = new TripRepository();
export const deliveryItemRepository = new DeliveryItemRepository();
export const walletRepository = new WalletRepository();
