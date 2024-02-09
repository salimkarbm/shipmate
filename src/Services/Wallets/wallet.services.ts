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
            const user: IUser | any = await userRepository.findUserById(userId);
            if (user) {
                if (user.wallets) {
                    return next(
                        new AppError(
                            'user wallet already exist',
                            statusCode.badRequest()
                        )
                    );
                }
                const wallet: any = await walletRepository.createWallet({
                    ...req.body,
                    userId
                });
                return wallet;
            }
            return next(new AppError('user not found', statusCode.notFound()));
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

    public async fundWallet(
        payload: any,
        userId: string,
        next: NextFunction
    ): Promise<IWallet | void> {
        const transaction =
            await walletRepository.findTransactionByTxnReferenceAndUserId(
                payload.transactionReference as string,
                payload.walletId
            );
        if (!transaction) {
            const wallet: IWallet | null =
                await walletRepository.findWalletByUserId(userId);
            if (wallet) {
                const creditWallet = {
                    balance: (Number(wallet.balance) +
                        Number(payload.amount)) as number,
                    currency: payload.currency,
                    updatedAt: payload.paidAt
                };
                const walletBalance = walletRepository.updateWallet(
                    creditWallet,
                    userId
                );
                const updateTransaction = {
                    amount: payload.amount,
                    transactionType: payload.transactionType,
                    description: payload.description,
                    transactionReference: payload.transactionReference,
                    transactionFee: payload.transactionFee,
                    transactionStatus: payload.transactionStatus,
                    transactionMethod: payload.transactionMethod,
                    walletId: payload.walletId
                };
                const newTransaction =
                    walletRepository.addTransaction(updateTransaction);
                const promises = await Promise.all([
                    newTransaction,
                    walletBalance
                ]);
                return promises[1] as IWallet;
            }
            return next(
                new AppError('Wallet not found', statusCode.notFound())
            );
        }
    }
}
