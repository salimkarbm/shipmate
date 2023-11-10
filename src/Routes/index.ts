import { Router } from 'express';
import authRoutes from './Auth/auth.routes';
import userRoutes from './Users/user.routes';

const router = Router();

// authentication routes
router.use('/auth', authRoutes);

// user routes
router.use('/users', userRoutes);

export default router;
