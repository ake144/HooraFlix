import express from 'express';
import {
	createFounderCode,
	deleteUser,
	getCodeStats,
	getFounderCodes,
	getPayments,
	getUsers,
} from '../controllers/admin.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes should be protected and require ADMIN role
router.use(authMiddleware);
router.use(isAdmin);

router.post('/founder-codes', createFounderCode);
router.get('/founder-codes', getFounderCodes);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/code-stats', getCodeStats);
router.get('/payments', getPayments);

export default router;
