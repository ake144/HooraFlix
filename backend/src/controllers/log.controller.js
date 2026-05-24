import prisma from '../config/database.js';

/**
 * Get recent activity logs (admin only)
 */
export const getRecentActivities = async (req, res, next) => {
    try {
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        res.json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
};

export default {
    getRecentActivities,
};
