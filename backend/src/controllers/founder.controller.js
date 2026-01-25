import prisma from '../config/database.js';
import crypto from 'crypto';
import { 
    generateAccessToken, 
    generateRefreshToken, 
    getRefreshTokenExpiry,
    verifyToken
} from '../utils/jwt.util.js';

/**
 * Verify founder code and activate founder status
 */
export const verifyFounderCode = async (req, res, next) => {
    try {
        const { code } = req.body;
        let userId = req.user?.userId;

        // Manually parse token if middleware didn't populate req.user
        if (!userId && req.headers.authorization?.startsWith('Bearer ')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
                userId = decoded.userId;
            } catch (error) {
                // Invalid token - proceed as unauthenticated
            }
        }

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
            const referralLink = `https://hoorafilx.com/signup?refId=${referralCode}`;

            // Create founder profile
            let founder;
            try {
                founder = await prisma.founder.create({
                    data: {
                        userId: user.id,
                        founderCode: code.toUpperCase(),
                        referralLink,
                        rank: 'GOLD'
                    }
                });
            } catch (error) {
                if (error.code === 'P2002' && error.meta?.target?.includes('founderCode')) {
                    return res.status(400).json({
                        success: false,
                        message: 'This founder code has already been claimed by another user'
                    });
                }
                throw error;
            }

            // Update user role
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isFounder: true,
                    role: 'FOUNDER'
                }
            });

            // Increment usage count and deactivate if it's a one-time code
            // For founder codes that are meant to be unique per founder (100 founders scenario),
            // we should deactivate them after use to ensure "no longer available"
            await prisma.founderCode.update({
                where: { id: founderCode.id },
                data: { 
                    usedCount: { increment: 1 },
                    // If maxUses is 1, or simply if we want to enforce single usage for founder uniqueness
                    isActive: founderCode.maxUses === 1 ? false : undefined 
                }
            });

            // Generate new tokens with FOUNDER role
            const accessToken = generateAccessToken(user.id, user.email, 'FOUNDER');
            const refreshToken = generateRefreshToken(user.id);

            // Store new refresh token
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: getRefreshTokenExpiry()
                }
            });

            return res.json({
                success: true,
                message: 'Founder status activated successfully',
                data: {
                    accessToken,
                    refreshToken,
                    founder: {
                        id: founder.id,
                        rank: founder.rank,
                        referralLink: founder.referralLink,
                        joinDate: founder.joinDate
                    },
                    user: {
                        ...user,
                        isFounder: true,
                        role: 'FOUNDER'
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
