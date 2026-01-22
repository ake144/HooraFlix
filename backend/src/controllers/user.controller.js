import prisma from '../config/database.js';

/**
 * Get user profile
 */
export const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                founder: {
                    select: {
                        id: true,
                        rank: true,
                        totalEarnings: true,
                        referralLink: true,
                        joinDate: true
                    }
                }
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isFounder: true,
                createdAt: true,
                founder: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isFounder: true
            }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        next(error);
    }
};
