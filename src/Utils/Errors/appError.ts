export default class AppError extends Error {
    statusCode: number;

    isOperational: boolean;

    status: string;

    constructor(message: string | any, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.message = message;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}
