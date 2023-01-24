import { Router } from 'express';
import validator from 'validator';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  getCards,
  delCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import BadRequestErr from '../errors/BadRequestErr';

const router = Router();

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(5).custom((value: string) => {
      console.log(value);
      if (validator.isURL(value)) return value;
      throw new BadRequestErr('Неправильная ссылка');
    }),
  }),
}), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), delCardById);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), dislikeCard);

export default router;
