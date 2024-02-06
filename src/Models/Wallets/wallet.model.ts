import { Model } from 'objection';
import { User } from '../Users/user.model';

export interface IWallet {
    userId: string;
    balance?: number;
    createdAt?: string;
    currency?: string;
    status?: string;
    updatedAt?: string;
    bankAccountNumber: string;
}

export class Wallet extends Model {
    static get tableName() {
        return 'wallets';
    }

    static get userIdColumn() {
        return 'userId';
    }

    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'wallets.userId',
                to: 'users.userId'
            }
        }
    };
}
