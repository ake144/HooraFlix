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
	updatePayoutStatus,
	getCoinClaims,
	getFounderStats,
	updatePassword,
	getMarketingAssets,
	createMarketingAsset,
	deleteMarketingAsset,
	getTrainingCourses,
	createTrainingCourse,
	deleteTrainingCourse
} from '../controllers/admin.controller.js';
import { getRecentActivities } from '../controllers/log.controller.js';
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
router.get('/activity', getRecentActivities);
router.patch('/password', updatePassword);

// Marketing Assets
router.get('/marketing-assets', getMarketingAssets);
router.post('/marketing-assets', createMarketingAsset);
router.delete('/marketing-assets/:id', deleteMarketingAsset);

// Training Courses
router.get('/training-courses', getTrainingCourses);
router.post('/training-courses', createTrainingCourse);
router.delete('/training-courses/:id', deleteTrainingCourse);


export default router;