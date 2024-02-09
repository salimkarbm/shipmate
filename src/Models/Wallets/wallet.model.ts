import { Model } from 'objection';
import { Transaction } from '../Transactions/transaction.model';

export interface IWallet {
    userId?: string;
    balance?: number;
    createdAt?: string;
    currency?: string;
    status?: string;
    updatedAt?: string;
    bankAccountNumber?: string;
    transactionReference?: string;
}

export class Wallet extends Model {
    static get tableName() {
        return 'wallets';
    }

    static get userIdColumn() {
        return 'userId';
    }

    static relationMappings = {
        transactions: {
            relation: Model.HasManyRelation,
            modelClass: Transaction,
            join: {
                from: 'wallets.walletId',
                to: 'transactions.walletId'
            }
        }
    };
}
