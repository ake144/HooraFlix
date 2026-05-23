import { Router } from 'express';
import { body } from 'express-validator';
import {
    verifyFounderCode,
    getFounderDashboard,
    getEarningsBreakdown,
    getReferrals,
    getStats,
    claimCoin,
    withdrawCoin
} from '../controllers/founder.controller.js';
import { authMiddleware, isFounder } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = Router();

// Validation rules
const codeValidation = [
    body('code').trim().notEmpty().withMessage('Founder code is required'),
    body('rank').optional().isString().withMessage('Rank must be a string')
];

// Routes
router.post('/verify-code', codeValidation, validate, verifyFounderCode);
router.get('/dashboard', authMiddleware, isFounder, getFounderDashboard);
router.get('/earnings/breakdown', authMiddleware, isFounder, getEarningsBreakdown);
router.get('/referrals', authMiddleware, isFounder, getReferrals);
router.get('/stats', authMiddleware, isFounder, getStats);
router.post('/claim-coin', authMiddleware, isFounder, claimCoin);
router.post('/withdraw-coin', authMiddleware, isFounder, withdrawCoin);

export default router;
