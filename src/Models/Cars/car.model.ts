import { Model } from 'objection';
import { User } from '../Users/user.model';

export interface ICar {
    carBrand: string;
    carModel: string;
    carColor: string;
    carRules: string;
    carPhoto: string;
    userId: string;
    carPhotoId: string;
    carRegistrationNumber: string | number;
    carPlateNumber: string | number;
}

export class Car extends Model {
    static get tableName() {
        return 'cars';
    }

    static get userIdColumn() {
        return 'userId';
    }

    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'cars.userId',
                to: 'users.userId'
            }
        }
    };
}
