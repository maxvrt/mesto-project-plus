import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { IGetUserRequest } from '../models/user';
import BadRequestError from '../errors/BadRequestErr';
import NotFoundError from '../errors/NotFoundErr';

export const createCard = (req: IGetUserRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;
  console.log(`ID пользователя ${userId}`);
  return Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) next(new BadRequestError('Неправильные поля карточки.'));
      next(error);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch((error) => {
    next(error);
  });

export const delCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndRemove({ _id: req.params.cardId });
    if (!card) throw new NotFoundError('Карточка по id не найдена.');
    return res.status(200).send({ data: card });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).send({ message: error.message });
    }
    return next(error);
  }
};

export const likeCard = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточка по id не найдена.');
    return res.status(200).send({ data: card });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Неправильные поля карточки.'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) throw new NotFoundError('Карточка по id не найдена.');
    return res.status(200).send({ data: card });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Неправильные поля пользователя.'));
    }
    return next(error);
  }
};
