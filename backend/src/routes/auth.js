import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;