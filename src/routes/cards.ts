import { Router } from 'express';
import {
  createCard,
  getCards,
  delCardById,
  likeCard,
  dislikeCard
} from '../controllers/cards';

const router = Router();

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', delCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

export default router;
