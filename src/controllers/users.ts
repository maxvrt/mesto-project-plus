import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { BadRequestError } from '../errors';
import NotFoundError from '../errors/NotFoundErr';
import mongoose from 'mongoose';

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      return res.status(201).send({ data: user })
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError)
        return res.status(400).send({ message: `Неправильно заполнены поля. ${err.message}` });
    }).catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new NotFoundError('Пользователь по id не найден');
      throw error;
    }
    return res.status(200).send({ data: user })
  } catch (error) {
    if (error instanceof NotFoundError)
      return res.status(error.statusCode).send({ message: error.message });
    next(error);
  }
}
