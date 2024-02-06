import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// import express
import express, { Application, Request, Response, NextFunction } from 'express';
import AppError from './Utils/Errors/appError';
import errorHandler from './Middlewares/Errors/errorMiddleware';
import logger from './Utils/Logger/index';
import routes from './Routes/index';
import db from './Database/db.config';
import { statusCode } from './Utils/HttpStatusCode/httpStatusCode';

dotenv.config({ path: './env' });

// Initialize express
const app: Application = express();

process.on('uncaughtException', (err) => {
    logger.error(err.name, err.message);
    logger.info('UNCAUGHT EXCEPTION! shutting down...');
    process.exit(1);
});

// Bind all Models to a knex instance
db.dbSetup();

// Database connection
db.onDatabaseConnect()
    .then((result: any) => {
        result.rowCount = 1
            ? logger.info('Database connected')
            : logger.info('Database not connected');
    })
    .catch((e: any) =>
        // console.log(e)
        logger.error(e)
    );

// Port
const PORT: number = Number(process.env.PORT) || 5000;
const address = `0.0.0.0:${PORT}`;

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://bca-healthcare.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    })
);

// Load Staic Files
app.use(express.static(path.join(`${__dirname}/src`, '../public/')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define index route
app.get('/', async (req: Request, res: Response) => {
    // res.sendFile('index.html');
    res.contentType('json');
    res.json({ status: 'ok', message: 'Welcome' });
});

app.get(
    '/shipmate',
    async (req: Request, res: Response, next: NextFunction) => {
        res.status(statusCode.ok()).json({
            success: true,
            message:
                'welcome to shipmate Api, please find the documentation here: https://documentations ',
            note: 'should you need any assistance kindly contact our support '
        });
    }
);

app.use('/api/v1', routes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    throw next(
        new AppError(
            `can't find ${req.originalUrl} on server!`,
            statusCode.notFound()
        )
    );
});

app.use(errorHandler);

// Listen for server connections
const server = app.listen(PORT, () => {
    logger.info(`server running on ${address}`);
});

process.on('unhandledRejection', (err: any) => {
    logger.error(err.name, err.message);
    logger.info('UNHANDLED REJECTION! shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

export default server;
