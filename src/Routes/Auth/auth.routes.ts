import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import {
    OTPEmailValidationRules,
    loginValidationRules,
    signUpValidationRules
} from '../../Middlewares/Auth/auth.middlewares';
import {
    activateUserAccount,
    login,
    resendOTP,
    signUp
} from '../../Controllers/Auth/auth.controllers';

const router = Router();

router.post('/signup', signUpValidationRules(), validate, signUp);
router.post('/login', loginValidationRules(), validate, login);
router.post('/resendOTP', OTPEmailValidationRules(), validate, resendOTP);
router.post(
    '/activateAccount',
    OTPEmailValidationRules(),
    validate,
    activateUserAccount
);

export default router;
