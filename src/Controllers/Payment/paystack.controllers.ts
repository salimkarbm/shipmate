import { Request, Response, NextFunction } from 'express';
import AppError from '../../Utils/Errors/appError';
import logger from '../../Utils/Logger';
import { statusCode } from '../../Utils/HttpStatusCode/httpStatusCode';
import { paystack } from '../../Services/Payment/paystack.services';

export const initializePaystackPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const payment = await paystack.initializePaystackPayment(req, next);
        if (payment) {
            return res.status(statusCode.created()).json({
                status: true,
                message: 'Payment Initialized',
                data: {
                    payment
                }
            });
        }
    } catch (err) {
        logger.error(`unable to Initialize Payment, ${err}`);
        return next(
            new AppError(
                `something went wrong! please try again later`,
                statusCode.internalServerError()
            )
        );
    }
};

export const paystackWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const payment = await paystack.paystackWebhook(req, res, next);
        return payment;
    } catch (err) {
        logger.error(`payment unsuccessful!, ${err} Please try again later`);
        return next(
            new AppError(
                `something went wrong! please try again later`,
                statusCode.internalServerError()
            )
        );
    }
};
