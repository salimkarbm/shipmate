import { Request, Response, NextFunction } from 'express';
import AppError from '../../Utils/Errors/appError';
import { walletService } from '../../Services/index';
import logger from '../../Utils/Logger';

import { statusCode } from '../../Utils/HttpStatusCode/httpStatusCode';
import { IWallet } from '../../Models/Wallets/wallet.model';

export const createWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const wallet = await walletService.createWallet(req, next);
        return res.status(statusCode.created()).json({
            status: 'success',
            message: 'Wallet created successfully.',
            data: {
                wallet
            }
        });
    } catch (err) {
        logger.error('unable to create Wallet', err);
        return next(
            new AppError(
                `something went wrong! please try again`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findUserWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const wallet: IWallet | void = await walletService.findUserWallet(
            req,
            next
        );
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Wallet Fetch successfully',
            data: {
                wallet
            }
        });
    } catch (err) {
        console.log(err);
        logger.error('unable to find Wallet', err);
        return next(
            new AppError(
                `something went wrong! please try again`,
                statusCode.internalServerError()
            )
        );
    }
};
