import { Request, Response, NextFunction } from 'express';
import TripService from '../../Services/Trips/tripService';
const tripStore = new TripService();

export default class orderController {
    public async addTrip(req: Request, res: Response, next: NextFunction) {
        return tripStore.addTrip(req, res, next);
    }
}
