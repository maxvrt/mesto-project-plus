import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IGetUserRequest, IUser } from '../models/user';
import BadRequestError from '../errors/BadRequestErr';
import NotFoundError from '../errors/NotFoundErr';
import AuthError from '../errors/AuthErr';
import DoubleErr from '../errors/DoubleErr';

const { JWT_SECRET = 'secret-key' } = process.env;

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    console.log('Вошли в create user');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.status(201).send({ data: user });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new DoubleErr(`Дубликат email. ${error.message}`));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError(`Неправильные поля пользователя. ${error.message}`));
    }
    return next(error);
  }
};

export const updateUser = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User
      .findByIdAndUpdate(req.user?._id, { name, about }, { runValidators: true, new: true });
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(201).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(new NotFoundError('Пользователь по id не найден'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Неправильные поля пользователя.'));
    }
    return next(error);
  }
};

export const updateAvatar = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { runValidators: true, new: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(201).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(new NotFoundError('Пользователь по id не найден'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Неправильные поля пользователя.'));
    }
    return next(error);
  }
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

export const getMe = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    console.log(`ИД пользователя ${req.user?._id}`);
    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(201).send({ data: user });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return next(new NotFoundError('Пользователь по id не найден'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequestError('Неправильные поля пользователя.'));
    }
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res.status(200).send({ data: user });
  } catch (error) {
    return next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err:Error) => {
      next(new AuthError('Неправильный логин или пароль'));
    });
};
