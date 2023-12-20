import { User } from './Users/user.model';
import { Car } from './Cars/car.model';
import { Trip } from './Trips/trip.model';
import { Item } from './Deliveries/delivery.model';

const TABLE = {
    USERS: User,
    CARS: Car,
    TRIPS: Trip,
    ITEMS: Item
};

export default TABLE;
