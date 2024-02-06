import { Router } from 'express';

import {
    initializePaystackPayment,
    paystackWebhook
} from '../../Controllers/Payment/paystack.controllers';
import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';

const router = Router();

router
    .route('/initializePaystack')
    .post(validate, authenticate, initializePaystackPayment);

router.route('/paystack/webhook').post(paystackWebhook);

export default router;
