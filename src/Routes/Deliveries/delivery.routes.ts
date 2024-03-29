import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import {
    deliveryValidationRules,
    deliveryIdValidationRules
} from '../../Middlewares/Deliveries/delivery.middlewares';
import { userIdValidationRules } from '../../Middlewares/Users/user.middlewares';
import item from '../../Controllers/index';
import { media } from '../../Utils/media/media';

const router = Router();

router
    .route('/')
    .post(
        media.upload.single('itemImage'),
        deliveryValidationRules(),
        validate,
        authenticate,
        item.addDeliveryItem
    )
    .get(validate, item.findDeliveryItems);

router
    .route('/:userId/user')
    .get(
        userIdValidationRules(),
        validate,
        authenticate,
        item.findUserDeliveryItems
    );

router
    .route('/:itemId')
    .get(deliveryIdValidationRules(), validate, item.findDeliveryItem);

export default router;
