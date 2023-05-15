import { Trip, TripType } from '../../Models/trips.model';

export default class TripRepository {
    async addTrip(trip: TripType): Promise<TripType> {
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
            userId,
        } = trip;
        const newTrip: any = await Trip.query().insert({
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
            userId,
        });
        return newTrip;
    }
}
