import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// Validation rules
const updateProfileValidation = [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
];

// Routes
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfileValidation, validate, updateProfile);

export default router;
