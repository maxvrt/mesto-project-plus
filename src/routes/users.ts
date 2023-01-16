import { Router } from 'express';
import { createUser, getUsers, getUserById } from '../controllers/users';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;
