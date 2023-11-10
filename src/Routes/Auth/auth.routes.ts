import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import {
    OTPEmailValidationRules,
    signUpValidationRules
} from '../../Middlewares/Auth/auth.middlewares';
import {
    activateUserAccount,
    signUp
} from '../../Controllers/Auth/auth.controllers';

const router = Router();

router.post('/signup', signUpValidationRules(), validate, signUp);
router.post(
    '/activateAccount',
    OTPEmailValidationRules(),
    validate,
    activateUserAccount
);

export default router;
