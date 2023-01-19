import { Router } from 'express';
import {
  createUser, getUsers, getUserById, updateUser, updateAvatar,
} from '../controllers/users';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
