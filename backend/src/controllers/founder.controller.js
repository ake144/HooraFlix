import prisma from '../config/database.js';
import crypto from 'crypto';

/**
 * Verify founder code and activate founder status
 */
export const verifyFounderCode = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user?.userId; // Optional - might not be authenticated

        // Find the founder code
        const founderCode = await prisma.founderCode.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!founderCode) {
            return res.status(404).json({
                success: false,
                message: 'Invalid founder code'
            });
        }

        if (!founderCode.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This founder code is no longer active'
            });
        }

        // Check usage limit
        if (founderCode.maxUses && founderCode.usedCount >= founderCode.maxUses) {
            return res.status(400).json({
                success: false,
                message: 'This founder code has reached its usage limit'
            });
        }

        // If user is authenticated, activate founder status
        if (userId) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { founder: true }
            });

            if (user.isFounder) {
                return res.status(400).json({
                    success: false,
                    message: 'You are already a founder'
                });
            }

            // Generate unique referral link
            const referralCode = crypto.randomBytes(4).toString('hex');
            const referralLink = `https://hooraflix.com/signup?refId=${referralCode}`;

            // Create founder profile
            const founder = await prisma.founder.create({
                data: {
                    userId: user.id,
                    founderCode: code.toUpperCase(),
                    referralLink,
                    rank: 'BRONZE'
                }
            });

            // Update user role
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isFounder: true,
                    role: 'FOUNDER'
                }
            });

            // Increment usage count
            await prisma.founderCode.update({
                where: { id: founderCode.id },
                data: { usedCount: { increment: 1 } }
            });

            return res.json({
                success: true,
                message: 'Founder status activated successfully',
                data: {
                    founder: {
                        id: founder.id,
                        rank: founder.rank,
                        referralLink: founder.referralLink,
                        joinDate: founder.joinDate
                    }
                }
            });
        }

        // If not authenticated, just verify the code is valid
        res.json({
            success: true,
            message: 'Founder code is valid',
            data: {
                codeValid: true
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get founder dashboard statistics
 */
export const getFounderDashboard = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        // Find founder profile
        const founder = await prisma.founder.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                referrals: {
                    include: {
                        referredUser: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                createdAt: true
                            }
                        }
                    },
                    orderBy: {
                        joinedAt: 'desc'
                    }
                }
            }
        });

        if (!founder) {
            return res.status(404).json({
                success: false,
                message: 'Founder profile not found'
            });
        }

        // Calculate statistics
        const totalReferrals = founder.referrals.length;
        const activeReferrals = founder.referrals.filter(r => r.status === 'ACTIVE').length;
        const pendingReferrals = founder.referrals.filter(r => r.status === 'PENDING').length;

        // Calculate next milestone
        const milestones = {
            BRONZE: { next: 'SILVER', threshold: 50 },
            SILVER: { next: 'GOLD', threshold: 100 },
            GOLD: { next: 'PLATINUM', threshold: 150 },
            PLATINUM: { next: null, threshold: null }
        };

        const currentMilestone = milestones[founder.rank];

        res.json({
            success: true,
            data: {
                user: {
                    name: founder.user.name,
                    email: founder.user.email,
                    joinDate: founder.joinDate,
                    rank: founder.rank
                },
                stats: {
                    totalReferrals,
                    activeReferrals,
                    pendingReferrals,
                    earnings: founder.totalEarnings,
                    nextMilestone: currentMilestone.threshold,
                    nextRank: currentMilestone.next
                },
                referralLink: founder.referralLink,
                founderId: founder.id
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get paginated list of referrals
 */
export const getReferrals = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find founder
        const founder = await prisma.founder.findUnique({
            where: { userId }
        });

        if (!founder) {
            return res.status(404).json({
                success: false,
                message: 'Founder profile not found'
            });
        }

        // Get total count
        const totalCount = await prisma.referral.count({
            where: { founderId: founder.id }
        });

        // Get paginated referrals
        const referrals = await prisma.referral.findMany({
            where: { founderId: founder.id },
            include: {
                referredUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                joinedAt: 'desc'
            },
            skip,
            take: limit
        });

        res.json({
            success: true,
            data: {
                referrals: referrals.map(ref => ({
                    id: ref.id,
                    name: ref.referredUser.name,
                    email: ref.referredUser.email,
                    status: ref.status,
                    joinedAt: ref.joinedAt
                })),
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get referral statistics
 */
export const getStats = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const founder = await prisma.founder.findUnique({
            where: { userId },
            include: {
                referrals: {
                    include: {
                        referredUser: true
                    }
                }
            }
        });

        if (!founder) {
            return res.status(404).json({
                success: false,
                message: 'Founder profile not found'
            });
        }

        // Group referrals by status
        const statusCounts = {
            ACTIVE: 0,
            PENDING: 0,
            INACTIVE: 0
        };

        founder.referrals.forEach(ref => {
            statusCounts[ref.status]++;
        });

        // Get referrals over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentReferrals = founder.referrals.filter(
            ref => new Date(ref.joinedAt) >= thirtyDaysAgo
        );

        res.json({
            success: true,
            data: {
                totalReferrals: founder.referrals.length,
                statusBreakdown: statusCounts,
                recentReferrals: recentReferrals.length,
                totalEarnings: founder.totalEarnings,
                rank: founder.rank
            }
        });
    } catch (error) {
        next(error);
    }
};
