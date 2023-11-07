import cors from 'cors';
// import dotenv
import dotenv from 'dotenv';

// import express
import express, { Application, Request, Response, NextFunction } from 'express';

import AppError from './Utils/Errors/appError';
import { errorHandler } from './Middlewares/Errors/errorMiddleware';
import logger from './Logger/index';

dotenv.config({ path: './env' });

process.on('uncaughtException', (err) => {
  logger.error(err.name, err.message);
  logger.info('UNCAUGHT EXCEPTION! shutting down...');
  process.exit(1);
});

// Initialize express
const app: Application = express();

// Port
const PORT: number = Number(process.env.PORT) || 3000;
const address = `0.0.0.0:${PORT}`;

app.use(
  cors({
    origin: ['http://localhost:8000', 'https://bca-healthcare.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  })
);

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

process.on('unhandledRejection', (err: any) => {
  logger.error(err.name, err.message);
  logger.info('UNHANDLED REJECTION! shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

export default server;
