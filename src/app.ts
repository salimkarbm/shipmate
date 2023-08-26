import cors from 'cors';
// import dotenv
import dotenv from 'dotenv';

// import express
import express, { Application, Request, Response, NextFunction } from 'express';

import AppError from './Utilities/Errors/appError';
import { errorHandler } from './Middlewares/Errors/errorMiddleware';
import  logger from  "./Logger/index"

dotenv.config({path:'./env'});

// Initialize express
const app: Application = express();

// Port
const PORT: number = Number(process.env.PORT) || 3000;
const address = `0.0.0.0:${PORT}`;

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define index route
app.get('/', async (req: Request, res: Response) => {
    // res.render('index');
    res.contentType('json');
    res.json({ status: 'ok', message: 'Welcome' });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, () =>
    logger.info(`server running on ${address}`)
);

export default server;
