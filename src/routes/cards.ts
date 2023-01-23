import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard,
  getCards,
  delCardById,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const router = Router();

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(5).max(130),
  }),
}), createCard);
router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().min(2).max(200)
      .required(),
  }),
}), delCardById);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().min(2).max(200)
      .required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().min(2).max(200)
      .required(),
  }),
}), dislikeCard);

export default router;
