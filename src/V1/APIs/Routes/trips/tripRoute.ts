import { Router } from 'express';
import tripController from '../../Controllers/Trips/tripController';
import { validate } from '../../Middlewares/validateRequest.middleware';
import { addTripValidationRules } from '../../Middlewares/Validations/tripValidation';

import { verifyToken } from '../../Middlewares/verifyToken.middleware';

const trip = Router();

const trips = new tripController();

trip.post(
    '/addTrip',
    addTripValidationRules(),
    validate,
    verifyToken,
    trips.addTrip
);

export default trip;
