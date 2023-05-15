import { body, check } from 'express-validator';

export const createOrderValidationRules = () => {
    return [
        check('destination')
            .trim()
            .notEmpty()
            .withMessage('destination name can not be empty')
            .isLength({ min: 1 })
            .withMessage('destination  must contain a character'),
        check('sender_name')
            .trim()
            .notEmpty()
            .withMessage('Sender name  can not be empty')
            .isLength({ min: 1, max: 100 })
            .withMessage('sender_name  must be between 1 and 100 characters'),
        check('item')
            .trim()
            .notEmpty()
            .withMessage('item name  can not be empty')
            .isLength({ min: 1, max: 100 })
            .withMessage('item  must be between 1 and 100 characters'),
        check('sender_number')
            .trim()
            .notEmpty()
            .withMessage('Sender number can not be empty')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone number must be 11 digit long'),
        check('reciever_name')
            .trim()
            .notEmpty()
            .withMessage('Reciever name  can not be empty')
            .isLength({ min: 1, max: 100 })
            .withMessage('sender_name  must be between 1 and 100 characters'),
        check('reciever_number')
            .trim()
            .notEmpty()
            .withMessage('Sender number can not be empty')
            .isLength({ min: 11, max: 11 })
            .withMessage('Sender number must be 11 digit long'),
    ];
};
