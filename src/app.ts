import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { IGetUserRequest } from './models/user';
import BadRequestError from './errors/BadRequestErr';
import NotFoundError from './errors/NotFoundErr';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req: IGetUserRequest, res: Response, next: NextFunction) => {
  req!.user = {
    _id: '63c41e7322eab1089c180c90',
  };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*',
  function(req: Request, res: Response) {
    res.status(404).send({ message: `Нет такой страницы` })
  }
);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BadRequestError)
    return res.status(err.statusCode).send({ message: err.message });
  return res.status(500).send({ message: `Общая ошибка: ${err.message} Type:${err.name}` });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} 111`);
});
