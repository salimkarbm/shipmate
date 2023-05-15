// import dotenv
import dotenv from 'dotenv';

// import express
import express, { Application, Request, Response, NextFunction } from 'express';

import routerV1 from './V1/APIs/Routes';
import { AppError } from './V1/APIs/Utilities/Errors/appError';
import errorHandler from './V1/APIs/Utilities/Errors/errorHandler';
import setupDb from './V1/APIs/Config/db/dbSetup';

dotenv.config({ path: './src/V1/APIs/Config/.env' });
// Initialize express
const app: Application = express();

// Bind all Models to a knex instance.
setupDb();

// Port
const PORT: number = Number(process.env.PORT) || 3000;
const address = `0.0.0.0:${PORT}`;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define index route
app.get('/', async (req: Request, res: Response) => {
    res.contentType('json');
    res.json({ status: 'ok', message: 'Welcome to DeliveryCog' });
});

// Routes
app.use('/api/v1', routerV1);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, () => console.log(`server running on ${PORT}`));

export default server;
