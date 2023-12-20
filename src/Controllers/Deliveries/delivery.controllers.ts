import { Request, Response, NextFunction } from 'express';
import { IDeliveryItem } from '../../Models/Deliveries/delivery.model';
import AppError from '../../Utils/Errors/appError';
import { deliveryItemService } from '../../Services/index';
import { statusCode } from '../../Utils/helpers';
import logger from '../../Utils/Logger';

export const addDeliveryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const item = await deliveryItemService.addDeliveryItem(req, next);
        if (item) {
            return res.status(statusCode.created()).json({
                status: 'success',
                message: 'Delivery Item created successfully.',
                data: {
                    item
                }
            });
        }
    } catch (err) {
        logger.error('unable to create Delivery', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findDeliveryItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deliveries: IDeliveryItem[] | void =
            await deliveryItemService.findDeliveryItems(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Deliveries Fetch successfully',
            data: {
                deliveries
            }
        });
    } catch (err) {
        logger.error('unable to find deliveries', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findDeliveryItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const delivery: IDeliveryItem | void =
            await deliveryItemService.findDeliveryItem(req, next);
        if (delivery) {
            return res.status(statusCode.ok()).json({
                status: 'success',
                message: 'Delivery Fetch successfully',
                data: {
                    delivery
                }
            });
        }
    } catch (err) {
        logger.error('unable to find Delivery', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findUserDeliveryItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deliveries: IDeliveryItem[] | void =
            await deliveryItemService.findUserDeliveryItems(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Deliveries Fetch successfully',
            data: {
                deliveries
            }
        });
    } catch (err) {
        logger.error('unable to find Deliveries', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};
