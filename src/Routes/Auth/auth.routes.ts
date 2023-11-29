import { Router } from 'express';

import validate from '../../Middlewares/reqValidation.middleware';
import {
    OTPEmailValidationRules,
    loginValidationRules,
    signUpValidationRules,
    refreshTokenValidationRules,
    resetPasswordValidationRules
} from '../../Middlewares/Auth/auth.middlewares';
import auth from '../../Controllers/index';

const router = Router();

router.post('/signup', signUpValidationRules(), validate, auth.signUp);
router.post('/login', loginValidationRules(), validate, auth.login);
router.post('/resendOTP', OTPEmailValidationRules(), validate, auth.resendOTP);
router.post(
    '/resetPassword',
    resetPasswordValidationRules(),
    validate,
    auth.resetPassword
);
router.post(
    '/forgotPassword',
    OTPEmailValidationRules(),
    validate,
    auth.forgotPassword
);
router.get(
    '/refreshToken',
    refreshTokenValidationRules(),
    validate,
    auth.refreshToken
);
router.post(
    '/activateAccount',
    OTPEmailValidationRules(),
    validate,
    auth.activateUserAccount
);

export default router;
