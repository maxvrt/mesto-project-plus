import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { IGetUserRequest } from '../models/user';
import BadRequestError from '../errors/BadRequestErr';
import NotFoundError from '../errors/NotFoundErr';
import ForbiddenErr from '../errors/ForbiddenErr';

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

export const delCardById = async (req: IGetUserRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndRemove({ _id: req.params.cardId });
    if (!card) {
      throw new NotFoundError('Карточка по не найдена.');
    } else {
      const userId = card.owner;
      if (req.user && userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenErr('Нет прав для удаления.');
      }
      return res.status(200).send({ data: card });
    }
  } catch (error) {
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
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Неправильные поля пользователя.'));
    }
    return next(error);
  }
};
