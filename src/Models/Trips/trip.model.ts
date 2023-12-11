import { Model } from 'objection';
import { User } from '../Users/user.model';

export interface ITrip {
    tripId?: string;
    departureCity: string;
    arrivalCity: string;
    departureDate: Date;
    departureLocation?: string; // Optional
    destinationLocation: string;
    estimatedDurationOfTrip: number;
    arrivalDate: Date;
    transportationMode: string;
    preferredItemType: string;
    acceptableLuggageSize: string;
    emergencyContactName: string;
    emergencyContactPhoneNumber: string;
    isPickupFromCustomerAddress?: boolean;
    arrivalPickupAddress?: string; // Optional
    itemPickupAddress?: string;
    userId: string;
    acceptableDeliveryDeadline?: number;
}

export class Trip extends Model {
    static get tableName() {
        return 'trips';
    }

    static get userIdColumn() {
        return 'userId';
    }

    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'trips.userId',
                to: 'users.userId'
            }
        }
    };
}
