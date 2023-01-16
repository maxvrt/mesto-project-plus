import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from '../routes/users';
import { IGetUserRequest } from '../models/user';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', userRouter);
// app.use('/cards', card);

app.use((req: IGetUserRequest, res: Response, next: NextFunction) => {
  req!.user = {
    _id: '63c41e7322eab1089c180c90',
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT} 111`);
});
