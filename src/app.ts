import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { IGetUserRequest } from './models/user';
import BadRequestError from './errors/BadRequestErr';
import NotFoundError from './errors/NotFoundErr';
import AuthError from './errors/AuthErr';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorMiddleware';

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Нет такой страницы' });
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} 111`);
});
