import { Request, Response, NextFunction } from 'express';
import { ITrip } from '../../Models/Trips/trip.model';
import AppError from '../../Utils/Errors/appError';
import { tripService } from '../../Services/index';
import logger from '../../Utils/Logger';

import HttpStatusCode from '../../Utils/HttpStatusCode/httpStatusCode';

const statusCode = new HttpStatusCode();

export const addTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const trip = await tripService.addTrip(req, next);
        return res.status(statusCode.created()).json({
            status: 'success',
            message: 'Trip created successfully.',
            data: {
                trip
            }
        });
    } catch (err) {
        logger.error('unable to add Trip', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const trip: ITrip[] | void = await tripService.findTrips(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Trips Fetch successfully',
            data: {
                trip
            }
        });
    } catch (err) {
        logger.error('unable to find trips', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const trip: ITrip | void = await tripService.findTrip(req, next);
        if (trip) {
            return res.status(statusCode.ok()).json({
                status: 'success',
                message: 'Trip Fetch successfully',
                data: {
                    trip
                }
            });
        }
    } catch (err) {
        logger.error('unable to find trip', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};

export const findUserTrips = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const trip: ITrip[] | void = await tripService.findUserTrips(req, next);
        return res.status(statusCode.ok()).json({
            status: 'success',
            message: 'Trips Fetch successfully',
            data: {
                trip
            }
        });
    } catch (err) {
        logger.error('unable to find trips', err);
        return next(
            new AppError(
                `something went wrong here is the error ${err}`,
                statusCode.internalServerError()
            )
        );
    }
};
