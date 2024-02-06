import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import {
    tripValidationRules,
    tripIdValidationRules
} from '../../Middlewares/Trips/trip.middlewares';
import { userIdValidationRules } from '../../Middlewares/Users/user.middlewares';
import trip from '../../Controllers/index';

const router = Router();

router
    .route('/')
    .post(tripValidationRules(), validate, authenticate, trip.addTrip)
    .get(validate, authenticate, trip.findTrips);

router
    .route('/user/:userId')
    .get(userIdValidationRules(), validate, authenticate, trip.findUserTrips);

router
    .route('/:tripId')
    .get(tripIdValidationRules(), validate, authenticate, trip.findTrip);

export default router;
