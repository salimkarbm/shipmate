import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
// import {
//  walletValidationRules,
// } from '../../Middlewares/Trips/trip.middlewares';
import { userIdValidationRules } from '../../Middlewares/Users/user.middlewares';
import wallet from '../../Controllers/index';

const router = Router();

router.route('/').post(validate, authenticate, wallet.createWallet);

router
    .route('/:userId/user')
    .get(
        userIdValidationRules(),
        validate,
        authenticate,
        wallet.findUserWallet
    );

export default router;
