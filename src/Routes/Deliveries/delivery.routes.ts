import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import authenticate from '../../Middlewares/tokenVerification.middleware';
import {
    deliveryValidationRules,
    deliveryIdValidationRules
} from '../../Middlewares/Deliveries/delivery.middlewares';
import item from '../../Controllers/index';
import { upload } from '../../Utils/helpers';

const router = Router();

router
    .route('/')
    .post(
        upload.single('itemImage'),
        deliveryValidationRules(),
        validate,
        authenticate,
        item.addDeliveryItem
    )
    .get(validate, item.findDeliveryItems);

router.route('/user').get(validate, authenticate, item.findUserDeliveryItems);

router
    .route('/:itemId')
    .get(deliveryIdValidationRules(), validate, item.findDeliveryItem);

export default router;
