import { body, check } from 'express-validator';

export const addTripValidationRules = () => {
    return [
        check('departure_date')
            .trim()
            .notEmpty()
            .withMessage('Departure Date can not be empty'),
        check('departure_time')
            .trim()
            .notEmpty()
            .withMessage('Departure time can not be empty'),
        check('duration_of_trip_in_hours')
            .trim()
            .notEmpty()
            .withMessage('Duration of trip in hours can not be empty'),
        check('duration_of_trip_in_mins')
            .trim()
            .notEmpty()
            .withMessage('Duration of trip in minute can not be empty'),
        check('departure_state')
            .trim()
            .notEmpty()
            .withMessage('Departure state can not be empty'),
        check('departure_city')
            .trim()
            .notEmpty()
            .withMessage('Departure city can not be empty'),
        check('pickup_address')
            .trim()
            .notEmpty()
            .withMessage('pickup address can not be empty'),
        check('destination_state')
            .trim()
            .notEmpty()
            .withMessage('Destination state can not be empty'),
        check('destination_city')
            .trim()
            .notEmpty()
            .withMessage('Destination city can not be empty'),
        check('delivery_address')
            .trim()
            .notEmpty()
            .withMessage('Delivery Address can not be empty'),
        check('estimated_price')
            .trim()
            .notEmpty()
            .withMessage('Estimated price can not be empty'),
    ];
};
