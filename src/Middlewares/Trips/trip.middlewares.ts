import { param, body } from 'express-validator';

export const tripIdValidationRules = () => {
    return [
        param('tripId')
            .trim()
            .notEmpty()
            .withMessage('Trip ID is required')
            .isString()
            .withMessage('Trip ID must be a string')
    ];
};

export const tripValidationRules = () => {
    return [
        // Departure City
        body('departureCity')
            .trim()
            .notEmpty()
            .withMessage('Departure City is required.')
            .isString()
            .withMessage('Departure City must be a string'),

        // Destination City
        body('destinationCity')
            .trim()
            .notEmpty()
            .withMessage('Destination City is required.')
            .isString()
            .withMessage('Destination City must be a string'),

        // Departure Date
        body('departureDate')
            .trim()
            .notEmpty()
            .withMessage('Departure Date is required.')
            .isDate()
            .withMessage('Departure Date must be a valid date.'),

        // Departure Location
        body('departureLocation')
            .trim()
            .notEmpty()
            .withMessage('Departure Location is required.')
            .isString()
            .withMessage('Departure Location must be a string'),

        // Destination Location
        body('destinationLocation')
            .trim()
            .notEmpty()
            .withMessage('Destination Location is required.')
            .isString()
            .withMessage('Destination Location must be a string'),

        // Estimated Duration of Arrival
        body('estimatedTimeOfArrival')
            .trim()
            .isString()
            .withMessage('Estimated Time of Arrival must be a string.')
            .optional({ checkFalsy: true }),

        // Travel Mode
        body('transportationMode')
            .trim()
            .notEmpty()
            .withMessage('Transportation Mode is required.')
            .isString()
            .withMessage('Transportation Mode must be a string.'),

        // Preferred Item Type
        // (Optional)
        body('preferredItemType')
            .trim()
            .isString()
            .withMessage('Preferred Item Type is required.')
            .optional({ checkFalsy: true }),

        // Acceptable Luggage Size
        body('acceptableLuggageSize')
            .trim()
            .isIn(['Small', 'Medium', 'Large'])
            .withMessage(
                'Acceptable Luggage Size must be one of: Small, Medium, Large.'
            ),

        // Emergency Contact Name
        body('emergencyContactName')
            .trim()
            .notEmpty()
            .withMessage('Emergency Contact Name is required.')
            .isString()
            .withMessage('Travel Mode must be a string.'),

        // Emergency Contact Phone Number
        body('emergencyContactPhoneNumber')
            .trim()
            .isMobilePhone(['en-US', 'en-NG'])
            .withMessage(
                'Emergency Contact Phone Number must be a valid mobile number.'
            ),

        // Is Pickup From Customer Address
        // (Optional)
        body('wePickupFromCustomerAddress')
            .trim()
            .isBoolean()
            .withMessage(
                'Is Pickup From Customer Address must be a boolean value.'
            )
            .optional({ checkFalsy: true }),

        // Arrival Pickup Address
        // (Optional)
        body('arrivalPickupAddress')
            .trim()
            .isString()
            .withMessage('Arrival Pickup Address must be a string.')
            .optional({ checkFalsy: true }),

        // Acceptable Delivery Deadline
        // (Optional)
        body('acceptingDeliveryFrom')
            .trim()
            .isString()
            .withMessage('Acceptable Delivery Deadline must be a dateTime.')
            .optional({ checkFalsy: true }),

        body('acceptingDeliveryTo')
            .trim()
            .isString()
            .withMessage('Acceptable Delivery Deadline must be a dateTime.')
            .optional({ checkFalsy: true })
    ];
};
