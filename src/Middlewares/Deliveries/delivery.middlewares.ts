import { param, body } from 'express-validator';

export const deliveryIdValidationRules = () => {
    return [
        param('itemId')
            .trim()
            .notEmpty()
            .withMessage('Item ID is required')
            .isString()
            .withMessage('Item ID must be a string')
    ];
};

export const deliveryValidationRules = () => {
    return [
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .trim()
            .withMessage('Description cannot start or end with whitespace'),
        body('pickUpAddress')
            .notEmpty()
            .withMessage('Pick up address is required')
            .trim()
            .withMessage('Pick up Address cannot start or end with whitespace'),
        body('dropOffAddress')
            .notEmpty()
            .withMessage('Drop off address is required')
            .trim()
            .withMessage(
                'Drop off Address cannot start or end with whitespace'
            ),
        body('itemCategory')
            .notEmpty()
            .withMessage('Item category is required')
            .trim(),
        body('ItemImage')
            .optional({ checkFalsy: true })
            .notEmpty()
            .withMessage('Item image is required')
            .isURL()
            .withMessage('Invalid image URL'),
        body('deliveryDeadline')
            .notEmpty()
            .withMessage('Delivery deadline is required')
            .trim()
            .withMessage(
                'Delivery deadline cannot start or end with whitespace'
            )
            .isISO8601({ strict: true, strictSeparator: true })
            .withMessage(
                'Delivery deadline must be a valid ISO 8601 date-time string'
            ),
        body('itemSize')
            .optional({ checkFalsy: true })
            .notEmpty()
            .withMessage('Item Size is required')
            .trim()
            .withMessage('Item Size cannot start or end with whitespace'),
        body('specialHandlingInstructions')
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 255 })
            .withMessage(
                'Special handling instructions must be 255 characters or less'
            )
    ];
};
