import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const resultErrors = [];
    errors
        .array()
        .map((err: any) => resultErrors.push({ [err.path]: err.msg }));

    resultErrors.push({ message: 'Action unsuccessful' });
    resultErrors.push({ success: false });
    const errorObject = Object.assign({}, ...resultErrors);
    return res.status(422).json(errorObject);
};

export default validate;
