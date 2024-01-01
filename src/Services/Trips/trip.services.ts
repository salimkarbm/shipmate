import { Request, NextFunction } from 'express';
import { ITrip } from '../../Models/Trips/trip.model';
import { IUser } from '../../Models/Users/user.model';
import { tripRepository, userRepository } from '../../Repository/index';
import AppError from '../../Utils/Errors/appError';
import { statusCode } from '../../Utils/helpers';

export default class TripService {
    public async findTrips(
        req: Request,
        next: NextFunction
    ): Promise<ITrip[] | void> {
        const trips = await tripRepository.findTrips();
        return trips as ITrip[];
    }

    public async findTrip(
        req: Request,
        next: NextFunction
    ): Promise<ITrip | void> {
        const { tripId } = req.params;
        const trip: ITrip | null = await tripRepository.findTripById(tripId);

        if (typeof trip === 'object' && trip !== null) {
            trip.users.OTP = 'undefined';
            trip.users.otpExpiresAt = undefined;
            return trip as ITrip;
        }
        return next(new AppError('Trip not found', statusCode.notFound()));
    }

    public async addTrip(
        req: Request,
        next: NextFunction
    ): Promise<ITrip | void> {
        const { userId } = req.user;
        if (userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const newTrip: any = await tripRepository.addTrip({
                ...req.body,
                userId
            });
            return newTrip;
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }

    public async findUserTrips(
        req: Request,
        next: NextFunction
    ): Promise<ITrip[] | void> {
        const { userId } = req.user;
        if (userId === req.params.userId) {
            const user: IUser | null =
                await userRepository.findUserById(userId);
            if (!user) {
                return next(
                    new AppError('user not found', statusCode.notFound())
                );
            }
            const trips = await tripRepository.findUserTrips(
                user.userId as unknown as string
            );
            return trips as ITrip[];
        }
        throw next(new AppError('Not authorized', statusCode.unauthorized()));
    }
}
