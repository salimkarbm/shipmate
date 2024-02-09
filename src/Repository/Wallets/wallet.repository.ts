import { IWallet } from '../../Models/Wallets/wallet.model';
import { ITransaction } from '../../Models/Transactions/transaction.model';
import TABLE from '../../Models/index';

export default class WalletRepository {
    async createWallet(payload: IWallet): Promise<IWallet> {
        const wallet: any = await TABLE.WALLET.query().insert(payload);
        return wallet as IWallet;
    }

    async addTransaction(payload: ITransaction): Promise<ITransaction> {
        const transaction: any =
            await TABLE.TRANSACTIONS.query().insert(payload);
        return transaction as ITransaction;
    }

    async findTransactionByTxnReferenceAndUserId(
        transactionReference: string,
        walletId: string
    ): Promise<ITransaction> {
        const transaction: any = await TABLE.TRANSACTIONS.query().where({
            transactionReference,
            walletId
        });
        return transaction[0] as ITransaction;
    }

    async findWalletByIdAndUserId(
        walletId: string,
        userId: string
    ): Promise<IWallet | null> {
        const wallet: any = await TABLE.WALLET.query()
            .where({ userId, walletId })
            .withGraphFetched('[wallets, wallets.[transactions]]');
        if (wallet.length > 0) {
            return wallet[0];
        }
        return null;
    }

    async findWalletByUserId(userId: string): Promise<IWallet | null> {
        const wallet: any = await TABLE.WALLET.query()
            .where('userId', userId)
            .withGraphFetched('transactions');
        if (wallet.length > 0) {
            return wallet[0];
        }
        return null;
    }

    async updateWallet(
        payload: IWallet,
        userId: string
    ): Promise<null | IWallet> {
        const wallet: any = await TABLE.WALLET.query()
            .where('userId', '=', userId)
            .update(payload)
            .returning('*');
        return wallet[0] as IWallet;
    }
}
