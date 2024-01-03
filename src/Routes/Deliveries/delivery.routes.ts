import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import {
    deliveryValidationRules,
    deliveryIdValidationRules
} from '../../Middlewares/Deliveries/delivery.middlewares';
import { userIdValidationRules } from '../../Middlewares/Users/user.middlewares';
import item from '../../Controllers/index';
import Media from '../../Utils/media/media';

const image = new Media();

const router = Router();

router
    .route('/')
    .post(
        image.upload.single('itemImage'),
        deliveryValidationRules(),
        validate,
        authenticate,
        item.addDeliveryItem
    )
    .get(validate, item.findDeliveryItems);

router
    .route('/:userId')
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
