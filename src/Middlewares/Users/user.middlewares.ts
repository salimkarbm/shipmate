import { param } from 'express-validator';

export const userIdValidationRules = () => {
    return [
        param('userId')
            .trim()
            .notEmpty()
            .withMessage('User ID is required')
            .isString()
            .withMessage('User ID must be a string')
    ];
};

export default userIdValidationRules;
