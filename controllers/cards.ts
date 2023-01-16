// @ts-ignore

import { Request, Response } from 'express';
import Card from '../models/card';
import { IGetUserRequest } from '../models/user';

export const createCard = (req: IGetUserRequest, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user?._id;
  // eslint-disable-next-line no-console
  console.log(userId);
  return Card.create({ name, link, userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
};

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500)
      .send({ message: 'Произошла ошибка' }));
};

export const delCardById = (req: Request, res: Response) => {
  return Card.find({ _id: req.params.cardId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: 'Произошла ошибка' }));
};

export const likeCard = (req: IGetUserRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  );
};

export const dislikeCard = (req: IGetUserRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  );
};
