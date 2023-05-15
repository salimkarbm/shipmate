import { Request, Response, NextFunction, Router } from 'express';
import userController from '../../Controllers/User/userController';

const router = Router();

const userTypes = new userController();

router.get('/:userType', userTypes.getRiders);

export default router;
