import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { IGetUserRequest } from './models/user';
import BadRequestError from './errors/BadRequestErr';
import NotFoundError from './errors/NotFoundErr';
import AuthError from './errors/AuthErr';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Нет такой страницы' });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BadRequestError || err instanceof AuthError) {
    return res.status(err.statusCode)
      .send({ message: err.message });
  }
  return res.status(500).send({ message: `Общая ошибка: ${err.message} Type:${err.name}` });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} 111`);
});
