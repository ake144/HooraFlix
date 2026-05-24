import prisma from '../config/database.js';
import { calculateCommission, findCommissionRuleForReferral, computeFounderCommissionSummary } from '../utils/commission.helper.js';
import crypto from 'crypto';
import { 
    generateAccessToken, 
    generateRefreshToken, 
    getRefreshTokenExpiry,
    verifyToken
} from '../utils/jwt.util.js';
import { logActivity } from '../utils/activity.logger.js';

/**
 * Verify founder code and activate founder status
 */
export const verifyFounderCode = async (req, res, next) => {
    try {
        const { code, rank } = req.body;
        let userId = req.user?.userId;
        const normalizedRank = typeof rank === 'string' && rank.trim()
            ? rank.trim().toUpperCase()
            : 'STARTER';

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
                        rank: normalizedRank
                    }
                });
                // Log affiliate/founder join
                logActivity('AFFILIATE_JOIN', user.email).catch?.(() => {});
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
            STARTER: { next: 'PROMOTER', threshold: 0 },
            PROMOTER: { next: 'GOLD', threshold: 100 },
            GOLD: { next: 'SILVER', threshold: 150 },
            BRONZE: { next: 'SILVER', threshold: 200 },
            SILVER: { next: 'PLATINUM', threshold: 250 },
            PLATINUM: { next: null, threshold: null }
        };

        const currentMilestone = milestones[founder.rank];
        
        let commissionTotal = 0;
        for (const ref of founder.referrals) {
            const rule = await findCommissionRuleForReferral({ founder, referral: ref });
            const baseAmount = ref.role === 'FOUNDER' ? 50 : 15;
            commissionTotal += calculateCommission(rule, baseAmount) || baseAmount;
        }

        // Include any additional earnings not tied to referrals
        const extraSum = await prisma.commissionEarning.aggregate({ _sum: { amount: true }, where: { founderId: founder.id } });
        commissionTotal += Number(extraSum._sum.amount || 0);

    

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
                    earnings:  commissionTotal,
                    coins: founder.coins,
                    lastClaimDate: founder.lastClaimDate,
                    claimStreak: founder.claimStreak,
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
 * Get earnings breakdown for founder: commissions + coin value + per-referral details
 */
export const getEarningsBreakdown = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const founder = await prisma.founder.findUnique({ where: { userId }, include: { referrals: { include: { referredUser: true } } } });
        if (!founder) return res.status(404).json({ success: false, message: 'Founder not found' });

        const breakdown = [];
        let commissionTotal = 0;

        // For each referral, determine commission and amount
        for (const ref of founder.referrals) {
            // find an applicable rule
            const rule = await findCommissionRuleForReferral({ founder, referral: ref });
            // baseAmount: we consider fixed referral reward as the base (legacy) — default map: Founder -> 50, User -> 15
            const baseAmount = ref.role === 'FOUNDER' ? 50 : 15;
            const amount = calculateCommission(rule, baseAmount) || baseAmount;

            breakdown.push({
                referralId: ref.id,
                referredUserId: ref.referredUser?.id || null,
                referredName: ref.referredUser?.name || ref.referredUser?.email || null,
                status: ref.status,
                commissionRuleId: rule?.id || null,
                commissionRuleName: rule?.name || null,
                amount
            });

            commissionTotal += Number(amount || 0);
        }

        // include existing CommissionEarning records not tied to referrals
        const extraSum = await prisma.commissionEarning.aggregate({ _sum: { amount: true }, where: { founderId: founder.id } });
        const recordedTotal = Number(extraSum._sum.amount || 0);

        // compute coin value
        const coinValue = Number(process.env.COIN_TO_MONEY_RATE || 0.01) * Number(founder.coins || 0);

        const total = commissionTotal + coinValue;

        res.json({
            success: true,
            data: {
                breakdown,
                commissionTotal,
                recordedTotal,
                coinValue,
                coins: founder.coins || 0,
                totalEarnings: total
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

/**
 * Claim coins for founder
 */
export const claimCoin = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const founder = await prisma.founder.findUnique({
            where: { userId } 
        });

        if (!founder) {
            return res.status(404).json({
                success: false,
                message: 'Founder profile not found'
            });
        }

        const today = new Date();
        const lastClaim = founder.lastClaimDate ? new Date(founder.lastClaimDate) : null;
        
        let streak = founder.claimStreak;
        let reward = 5;

        // Check if claimed today
        if (lastClaim && lastClaim.toDateString() === today.toDateString()) {
             return res.status(400).json({
                success: false,
                message: 'You have already claimed your daily reward today.'
            });
        }

        // Check if streak continues (claimed yesterday)
        if (lastClaim) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastClaim.toDateString() === yesterday.toDateString()) {
                streak += 1;
            } else {
                streak = 1; // Reset streak if missed a day
            }
        } else {
            streak = 1; // First claim
        }

        // Calculate Reward
        const rewardsMap = [5, 10, 15, 20, 25, 30, 50];
        const dayIndex = (streak - 1) % 7;
        reward = rewardsMap[dayIndex];

        // Monthly Bonus (30 days streak)
        if (streak % 30 === 0) {
            reward += 200;
        }

        const updatedFounder = await prisma.founder.update({
            where: { userId },
            data: { 
                coins: { increment: reward },
                lastClaimDate: today,
                claimStreak: streak
            }
        });

                // Record claim event for admin aggregation
                try {
                    await prisma.coinClaim.create({
                        data: {
                            founderId: updatedFounder.id,
                            amount: reward
                        }
                    });
                } catch (e) {
                    console.error('Failed to record coin claim:', e);
                }

        res.json({ 
            success: true, 
            message: `You claimed ${reward} coins! Streak: ${streak} days.`,
            data: {
                coins: updatedFounder.coins,
                streak: updatedFounder.claimStreak,
                reward,
                lastClaimDate: updatedFounder.lastClaimDate
            } 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Withdraw coins request (Deprecated)
 */
export const withdrawCoin = async (req, res, next) => {
    res.status(400).json({
        success: false,
        message: 'Withdrawal feature is currently disabled.'
    });
};

/**
 * Get transaction history (commission, coins, payouts)
 */
export const getTransactions = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Find founder
        const founder = await prisma.founder.findUnique({ where: { userId } });
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder not found' });
        }

        // Fetch all transaction types
        const commissions = await prisma.commissionEarning.findMany({
            where: { founderId: founder.id },
            select: { id: true, amount: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        const coinClaims = await prisma.coinClaim.findMany({
            where: { founderId: founder.id },
            select: { id: true, amount: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        const payouts = await prisma.payoutRequest.findMany({
            where: { founderId: founder.id },
            select: { id: true, amount: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        // Combine and format transactions
        const transactions = [
            ...commissions.map(c => ({
                id: c.id,
                date: c.createdAt,
                type: 'Commission',
                amount: c.amount,
                status: 'Completed'
            })),
            ...coinClaims.map(c => ({
                id: c.id,
                date: c.createdAt,
                type: 'Coin Claim',
                amount: c.amount * (Number(process.env.COIN_TO_MONEY_RATE || 0.01)),
                status: 'Completed'
            })),
            ...payouts.map(p => ({
                id: p.id,
                date: p.createdAt,
                type: 'Withdrawal',
                amount: -p.amount,
                status: p.status === 'PAID' ? 'Completed' : p.status === 'PENDING' ? 'Pending' : p.status === 'APPROVED' ? 'Approved' : 'On Hold'
            }))
        ];

        // Sort by date descending
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Paginate
        const totalCount = transactions.length;
        const totalPages = Math.ceil(totalCount / limit);
        const paginatedTransactions = transactions.slice(skip, skip + limit);

        res.json({
            success: true,
            data: {
                transactions: paginatedTransactions,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
