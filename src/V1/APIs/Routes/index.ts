import { Router } from 'express';
import authRouter from './auth/auth.router';
import deliveryRouter from './delivery/deliveryRoute';
import tripRouter from './trips/tripRoute';
import swaggerDoc from 'swagger-ui-express';
import swaggerDocumentation from '../Docs/swagger.config';

const router = Router();

router.use('/auth', authRouter);
router.use('/delivery', deliveryRouter);
router.use('/trip', tripRouter);
router.use('/documentation', swaggerDoc.serve);
router.use('/documentation', swaggerDoc.setup(swaggerDocumentation));

export default router;
