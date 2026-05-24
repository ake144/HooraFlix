import express from 'express';
import {
	createFounderCode,
	deleteUser,
	getCodeStats,
	getFounderCodes,
	getPayments,
	getUsers,
    getCommissionRules,
	createCommissionRule,
	toggleCommissionRule,
	getPayouts,
	updatePayoutStatus
    ,getCoinClaims,
	getFounderStats
} from '../controllers/admin.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes should be protected and require ADMIN role
router.use(authMiddleware);
router.use(isAdmin);


router.get('/dashboard-stats', getFounderStats),
router.post('/founder-codes', createFounderCode);
router.get('/founder-codes', getFounderCodes);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/code-stats', getCodeStats);
router.get('/payments', getPayments);
router.get('/commission-rules', getCommissionRules);
router.post('/commission-rules', createCommissionRule);
router.patch('/commission-rules/:id/toggle', toggleCommissionRule);
router.get('/payouts', getPayouts);
router.patch('/payouts/:id/status', updatePayoutStatus);
router.get('/coin-claims', getCoinClaims);


export default router;