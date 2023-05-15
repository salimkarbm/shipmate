import { Request, Response, NextFunction } from 'express';
import TripRepository from '../../Repository/Trips/tripRepository';
import { response } from '../../Utilities/response';
const tripRepository = new TripRepository();
export default class TripService {
    public async addTrip(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                departure_date,
                departure_time,
                duration_of_trip_in_hours,
                duration_of_trip_in_mins,
                departure_state,
                departure_city,
                pickup_address,
                destination_state,
                destination_city,
                delivery_address,
                estimated_price,
            } = req.body;

            const trip = await tripRepository.addTrip({
                departure_date,
                departure_time,
                duration_of_trip_in_hours,
                duration_of_trip_in_mins,
                departure_state,
                departure_city,
                pickup_address,
                destination_state,
                destination_city,
                delivery_address,
                estimated_price,
                userId: req.user.id,
            });

            if (!trip) {
                return res.status(500).json(
                    response({
                        success: false,
                        message: 'Failed to create Trip',
                    })
                );
            }
            return res.status(201).json({
                success: true,
                message: 'Trip created succesfully!',
                trip,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }
}
