import express from 'express';
import { createFounderCode, getFounderCodes } from '../controllers/admin.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes should be protected and require ADMIN role
router.use(authMiddleware);
router.use(isAdmin);

router.post('/founder-codes', createFounderCode);
router.get('/founder-codes', getFounderCodes);

export default router;
