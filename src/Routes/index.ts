import { Router } from 'express';
import authRoutes from './Auth/auth.routes';
import userRoutes from './Users/user.routes';
import tripRoutes from './Trips/trip.routes';
import deliveryRoutes from './Deliveries/delivery.routes';
import paymentRoutes from './Payment/paystack.routes';

const router = Router();

// authentication routes
router.use('/auth', authRoutes);

// user routes
router.use('/users', userRoutes);

// trip routes
router.use('/trips', tripRoutes);

// delivery routes
router.use('/deliveries', deliveryRoutes);

// Payment routes
router.use('/payment', paymentRoutes);

export default router;
