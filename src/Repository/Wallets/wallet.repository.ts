import { IWallet } from '../../Models/Wallets/wallet.model';
import TABLE from '../../Models/index';

export default class WalletRepository {
    async createWallet(payload: IWallet): Promise<IWallet> {
        const wallet: any = await TABLE.WALLET.query().insert(payload);
        return wallet as IWallet;
    }

    async findWalletByUserId(userId: string): Promise<IWallet | null> {
        const wallet: any = await TABLE.WALLET.query()
            .where('userId', userId)
            .withGraphFetched('users');
        if (wallet.length > 0) {
            return wallet[0];
        }
        return null;
    }
}
