import { Model } from 'objection';

export interface TripType {
    id?: number;
    departure_date: string;
    departure_time: string;
    duration_of_trip_in_hours: string;
    duration_of_trip_in_mins: string;
    departure_state: string;
    departure_city: string;
    pickup_address: string;
    destination_state: string;
    destination_city: string;
    delivery_address: string;
    estimated_price: string | number;
    userId?: string | number;
    created_at?: string;
    updateds_at?: string;
}

export class Trip extends Model {
    static get tableName() {
        return 'trips';
    }
}
