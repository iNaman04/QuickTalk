import express from 'express';
import { login, logout, signup, updateProfile } from '../controllers/auth_controller.js';
import { protectRoute } from '../middleware/auth_middleware.js';

const router = express.Router();

router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout);

router.put("/update-profile",protectRoute, updateProfile);

export default router;