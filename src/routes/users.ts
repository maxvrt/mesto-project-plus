import { Router } from 'express';
import validator from 'validator';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUserById, updateUser, updateAvatar, getMe,
} from '../controllers/users';
import BadRequestErr from '../errors/BadRequestErr';

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(5).custom((value: string) => {
      if (validator.isURL(value)) return value;
      throw new BadRequestErr('Неправильная ссылка');
    }),
  }),
}), updateAvatar);
export default router;
