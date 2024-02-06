import { Request, NextFunction } from 'express';
import { IWallet } from '../../Models/Wallets/wallet.model';
import { walletRepository, userRepository } from '../../Repository/index';
import { IUser } from '../../Models/Users/user.model';
import AppError from '../../Utils/Errors/appError';
import { statusCode } from '../../Utils/HttpStatusCode/httpStatusCode';

export default class WalletService {
    public async createWallet(
        req: Request,
        next: NextFunction
    ): Promise<IWallet | void> {
        const { userId } = req.user;
        if (userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const wallet: any = await walletRepository.createWallet({
                ...req.body,
                userId
            });
            return wallet;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async findUserWallet(
        req: Request,
        next: NextFunction
    ): Promise<IWallet | void> {
        const { userId } = req.params;
        const wallet: IWallet | null =
            await walletRepository.findWalletByUserId(userId);
        if (wallet) {
            return wallet as IWallet;
        }
        return next(new AppError('Wallet not found', statusCode.notFound()));
    }
}
