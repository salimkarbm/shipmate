import { ITrip } from '../../Models/Trips/trip.model';
import TABLE from '../../Models/index';

export default class TripRepository {
    async addTrip(payload: ITrip): Promise<ITrip> {
        const trip: any = await TABLE.TRIPS.query().insert(payload);
        return trip as ITrip;
    }

    async findTripById(tripId: string): Promise<ITrip | null> {
        const trip: any = await TABLE.TRIPS.query()
            .where('tripId', tripId)
            .withGraphFetched('users');
        if (trip.length > 0) {
            return trip[0];
        }
        return null;
    }

    async findTrips(): Promise<ITrip[]> {
        const trips = await TABLE.TRIPS.query()
            .select('*')
            .withGraphFetched('users');
        return trips as any;
    }

    async findUserTrips(userId: string): Promise<ITrip[] | null> {
        const trip: any = await TABLE.TRIPS.query()
            .where('userId', userId)
            .withGraphFetched('users');
        if (trip.length > 0) {
            return trip;
        }
        return null;
    }

    async updateTrip(payload: ITrip, tripId: string): Promise<null | ITrip> {
        const trip: any = await TABLE.TRIPS.query()
            .where('tripId', '=', tripId)
            .update(payload)
            .returning('*');
        return trip[0] as ITrip;
    }
}
