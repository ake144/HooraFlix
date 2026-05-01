import prisma from '../config/database.js';

// Get all notifications for the logged-in user
export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to 50 recent notifications
        });

        res.json({ success: true, data: notifications });
    } catch (error) {
        next(error);
    }
};

// Mark a single notification as read
export const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!notification || notification.userId !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};
