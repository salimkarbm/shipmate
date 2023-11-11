import { body, check } from 'express-validator';

export const signUpValidationRules = () => {
    return [
        body('firstName')
            .trim()
            .notEmpty()
            .withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
        body('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone Number is required')
            .isLength({ min: 10, max: 15 })
            .withMessage('Phone Number must be 10 digits'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6, max: 16 })
            .withMessage(
                'Password must be between min of 8 and max of 16 characters'
            ),
        body('confirmPassword')
            .trim()
            .notEmpty()
            .withMessage('Confirm Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage(
                'Password must be between min of 8 and max of 16 characters'
            ),
        body('email').trim().isEmail().withMessage('Email is required ')
    ];
};

export const loginValidationRules = () => {
    return [
        body('email').trim().isEmail().withMessage('Email is required'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password Email is required')
            .isLength({ min: 8, max: 16 })
            .withMessage(
                'Password must be between min of 6 and max of 16 characters'
            )
    ];
};

export const OTPEmailValidationRules = () => {
    return [
        body('OTP')
            .if(body('OTP').exists())
            .trim()
            .notEmpty()
            .withMessage('OTP is required')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP code must be 6 digit long'),
        body('email')
            .if(body('email').exists())
            .trim()
            .isEmail()
            .withMessage('Email is required')
    ];
};

export const refreshTokenValidationRules = () => {
    return [
        check('x-user-email')
            .notEmpty()
            .withMessage('Email header is required'),
        check('x-user-token')
            .notEmpty()
            .withMessage('Refresh Token header is required')
    ];
};
