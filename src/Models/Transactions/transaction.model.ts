import { Model } from 'objection';
import { Wallet } from '../Wallets/wallet.model';

export interface ITransaction {
    transactionId?: string;
    amount: number;
    transactionType: 'Credit' | 'Debit';
    description: string;
    transactionReference: string;
    transactionFee: number;
    transactionStatus: 'Complete' | 'Pending';
    transactionMethod: 'Card' | 'Bank Transfer';
    walletId: string; // Assuming this is a UUID
}

export class Transaction extends Model {
    static get tableName() {
        return 'transactions';
    }

    static get transactionIdColumn() {
        return 'transactionId';
    }

    static relationMappings = {
        wallets: {
            relation: Model.BelongsToOneRelation,
            modelClass: Wallet,
            join: {
                from: 'transactions.transactionId',
                to: 'wallets.walletId'
            }
        }
    };
}
