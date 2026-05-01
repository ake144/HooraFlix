import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import {  authMiddleware, isFounder } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use( authMiddleware, isFounder);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
