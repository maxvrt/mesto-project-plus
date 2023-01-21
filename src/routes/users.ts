import { Router } from 'express';
import {
  getUsers, getUserById, updateUser, updateAvatar, getMe,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/me', getMe);
export default router;
