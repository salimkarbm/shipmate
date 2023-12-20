import AuthService from './Auth/auth.services';
import UserService from './Users/user.services';
import TripService from './Trips/trip.services';
import DeliveryItemService from './Deliveries/delivery.services';

export const authService = new AuthService();
export const userService = new UserService();
export const tripService = new TripService();
export const deliveryItemService = new DeliveryItemService();
