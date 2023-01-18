import { NextFunction, Request, Response } from 'express';
import User, { IGetUserRequest } from '../models/user';
import BadRequestError from '../errors/BadRequestErr';
import NotFoundError from '../errors/NotFoundErr';
import mongoose from 'mongoose';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({name, about, avatar});
    return res.status(201).send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError)
      next(new BadRequestError('Неправильные поля пользователя.'));
    next(error);
  }
};

export const updateUser = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try{
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, { name, about }, { runValidators: true });
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(201).send({ data: user })
  } catch (error) {
    if (error instanceof NotFoundError)
      return res.status(error.statusCode).send({ message: error.message });
    else if (error instanceof mongoose.Error.ValidationError)
      next(new BadRequestError('Неправильные поля пользователя.'));
    next(error);
  }
}

export const updateAvatar = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try{
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, { avatar }, { runValidators: true });
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(201).send({ data: user })
  } catch (error) {
    if (error instanceof NotFoundError)
      return res.status(error.statusCode).send({ message: error.message });
    else if (error instanceof mongoose.Error.ValidationError)
      next(new BadRequestError('Неправильные поля пользователя.'));
    next(error);
  }
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(200).send({ data: user })
  } catch (error) {
    if (error instanceof NotFoundError)
      return res.status(error.statusCode).send({ message: error.message });
    next(error);
  }
}
