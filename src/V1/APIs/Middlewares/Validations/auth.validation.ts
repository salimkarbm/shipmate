import { body, check } from 'express-validator';

export const registerValidationRules = () => {
    return [
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('please enter a valid email'),
        check('firstName')
            .trim()
            .notEmpty()
            .withMessage('first name can not be empty')
            .isLength({ min: 1, max: 20 })
            .withMessage('First name  must be between 1 and 20 characters'),

        check('lastName')
            .trim()
            .notEmpty()
            .withMessage('last name can not be empty')
            .isLength({ min: 1, max: 20 })
            .withMessage('Last name  must be between 1 and 20 characters'),

        check('password')
            .trim()
            .notEmpty()
            .withMessage('Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage('Password must be between 6 and 16 characters'),
        check('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone number can not be empty')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone number must be 11 digit long'),
    ];
};

export const loginValidationRules = () => {
    return [
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('please enter a valid email'),
        check('password')
            .trim()
            .notEmpty()
            .withMessage('Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage('Password must be between 6 and 16 characters'),
    ];
};
export const otpValidationRules = () => {
    return [
        body('code')
            .isLength({ min: 6 })
            .isNumeric()
            .withMessage('code must be at least 6 character long'),
    ];
};

export const refreshTokenValidationRules = () => {
    return [
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('please enter a valid email'),
        body('refreshToken').trim().notEmpty(),
    ];
};
export const emailValidationRules = () => {
    return [
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('please enter a valid email'),
    ];
};
export const restPasswordValidationRules = () => {
    return [
        check('password')
            .trim()
            .notEmpty()
            .withMessage('Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage('Password must be between 6 and 16 characters'),
        check('confirmPassword')
            .trim()
            .notEmpty()
            .withMessage('Confirm Password can not be empty')
            .isLength({ min: 6, max: 16 })
            .withMessage(
                'Confirm Password must be between 6 and 16 characters'
            ),
        check('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('please enter a valid email'),
        check('code')
            .isLength({ min: 6, max: 6 })
            .isNumeric() //TODO: check if message error is returned when triggered
            .withMessage('code must be at least 6 character long'),
    ];
};
