import { Model } from 'objection';
import { User } from '../Users/user.model';
import { Trip } from '../Trips/trip.model';

export interface IDeliveryItem {
    deliveryId?: string;
    userId: string;
    description: string;
    pickUpAddress: string;
    dropOffAddress: string;
    itemCategory: string;
    ItemImage: string;
    ItemImageId: string;
    itemSize: string;
    specialHandlingInstructions: string;
    insuranceCoverage: boolean;
    deliveryDeadline: Date;
}

export class Item extends Model {
    static get tableName() {
        return 'items';
    }

    static get userIdColumn() {
        return 'userId';
    }

    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'items.userId',
                to: 'users.userId'
            }
        },

        trips: {
            relation: Model.BelongsToOneRelation,
            modelClass: Trip,
            join: {
                from: 'items.tripId',
                to: 'trips.tripId'
            }
        }
    };
}
