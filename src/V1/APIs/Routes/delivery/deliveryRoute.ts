import { Router } from 'express';
import deliveryController from '../../Controllers/Delivery/deliveryController';
import { validate } from '../../Middlewares/validateRequest.middleware';
import { createOrderValidationRules } from '../../Middlewares/Validations/order.validation';

import { verifyToken } from '../../Middlewares/verifyToken.middleware';

const order = Router();

const deliveries = new deliveryController();

order.post(
    '/',
    verifyToken,
    createOrderValidationRules(),
    validate,
    deliveries.createDelivery
);

order.get('/all', verifyToken, deliveries.getAllDelivery);

order.get('/:deliveryId', verifyToken, deliveries.getDeliveryById);

export default order;
