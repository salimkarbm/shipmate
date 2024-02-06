import { User } from './Users/user.model';
import { Car } from './Cars/car.model';
import { Trip } from './Trips/trip.model';
import { Item } from './Deliveries/delivery.model';
import { Wallet } from './Wallets/wallet.model';

const TABLE = {
    USERS: User,
    CARS: Car,
    TRIPS: Trip,
    ITEMS: Item,
    WALLET: Wallet
};

export default TABLE;
