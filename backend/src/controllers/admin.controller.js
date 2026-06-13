import prisma from '../config/database.js';
import { randomBytes } from 'crypto';

// Generate a random 8-character alphanumeric string
const generateRandomCode = () => {
  return randomBytes(4).toString('hex').toUpperCase();
};

export const createFounderCode = async (req, res, next) => {
  try {
    const { code, maxUses } = req.body;

    const finalCode = code || generateRandomCode();

    // Check if code already exists
    const existingCode = await prisma.founderCode.findUnique({
      where: { code: finalCode }
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'Founder code already exists. Please choose a different one.'
      });
    }

    const newCode = await prisma.founderCode.create({
      data: {
        code: finalCode,
        maxUses: maxUses ? parseInt(maxUses) : null,
        isActive: true,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Founder code created successfully',
      data: newCode
    });
  } catch (error) {
    next(error);
  }
};

export const getFounderCodes = async (req, res, next) => {
  try {
    const codes = await prisma.founderCode.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: codes
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isFounder: true,
        createdAt: true,
        founder: {
          select: {
            rank: true,
            totalEarnings: true,
            coins: true,
          },
        },
        referredBy: {
          select: {
            status: true,
            joinedAt: true,
            founder: {
              select: {
                rank: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    await prisma.user.delete({ where: { id } });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCodeStats = async (req, res, next) => {
  try {
    const [totalUsers, totalFounders, activeCodes, totalCodes] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'FOUNDER' } }),
      prisma.founderCode.count({ where: { isActive: true } }),
      prisma.founderCode.count(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFounders,
        activeCodes,
        totalCodes,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const founders = await prisma.founder.findMany({
      select: {
        id: true,
        totalEarnings: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });

    const payments = founders.map((f) => ({
      id: f.id,
      userEmail: f.user.email,
      amount: f.totalEarnings,
      date: f.updatedAt,
    }));

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommissionRules = async (req, res, next) => {
  try {
    const rules = await prisma.commissionRule.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: rules
    });
  } catch (error) {
    next(error);
  }
};

export const createCommissionRule = async (req, res, next) => {
  try {
    const { name, scopeMode, role, rank, offer, level, rewardType, value, stackable, note } = req.body;

    if (!name || !scopeMode || !rewardType) {
      return res.status(400).json({
        success: false,
        message: 'Name, scope mode, and reward type are required.',
      });
    }

    const newRule = await prisma.commissionRule.create({
      data: {
        name,
        scopeMode: scopeMode.toUpperCase(),
        role: role ? role.toUpperCase() : null,
        rank: rank ? rank.toUpperCase() : null,
        offer,
        level: level ? String(level) : null,
        rewardType: rewardType.toUpperCase(),
        value: parseFloat(value),
        stackable: Boolean(stackable),
        note
      }
    });

    res.status(201).json({
      success: true,
      data: newRule
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCommissionRule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Rule status is required.',
      });
    }

    const updated = await prisma.commissionRule.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const getPayouts = async (req, res, next) => {
  try {
    const payouts = await prisma.payoutRequest.findMany({
      include: {
        founder: {
          include: {
            user: true
          }
        },
        commissionRule: {
          select: {
            name: true,
            scopeMode: true,
            role: true,
            rank: true,
            rewardType: true,
            value: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedPayouts = payouts.map(p => ({
      id: p.id,
      founderEmail: p.founder.user.email,
      amount: p.amount,
      status: p.status,
      date: p.createdAt,
      notes: p.notes,
      scope: p.commissionRule
        ? p.commissionRule.rank
          ? `Founder / ${p.commissionRule.rank}`
          : p.commissionRule.role
            ? `Role: ${p.commissionRule.role}`
            : p.commissionRule.scopeMode
        : 'Founder / GOLD',
      role: p.commissionRule?.role || 'FOUNDER',
      rank: p.commissionRule?.rank || 'GOLD',
      commissionRuleName: p.commissionRule?.name || null,
    }));

    res.json({
      success: true,
      data: formattedPayouts
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayoutStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Payout status is required.',
      });
    }

    const updated = await prisma.payoutRequest.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    // Log payout status change
    try {
      const { logActivity } = await import('../utils/activity.logger.js');
      logActivity('PAYOUT_UPDATE', `Payout ${id} -> ${status.toUpperCase()}`);
    } catch (e) {
      console.error('Failed to log payout update', e);
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get coin claim stats. Query param `date=YYYY-MM-DD` returns totals for that day.
 * If no date provided, returns last 7 days series and recent claims.
 */
export const getCoinClaims = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (date) {
      const start = new Date(date + 'T00:00:00');
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const claims = await prisma.coinClaim.findMany({
        where: { createdAt: { gte: start, lt: end } },
        include: { founder: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      });

      const total = claims.reduce((s, c) => s + (c.amount || 0), 0);

      return res.json({ success: true, data: { date, total, claims } });
    }

    // last 7 days
    const days = 7;
    const start = new Date();
    start.setDate(start.getDate() - (days - 1));
    start.setHours(0, 0, 0, 0);

    const claims = await prisma.coinClaim.findMany({
      where: { createdAt: { gte: start } },
      include: { founder: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 1000
    });

    // group by date
    const seriesMap = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      seriesMap[key] = 0;
    }

    claims.forEach(c => {
      const key = c.createdAt.toISOString().slice(0, 10);
      if (!seriesMap[key]) seriesMap[key] = 0;
      seriesMap[key] += c.amount || 0;
    });

    const series = Object.keys(seriesMap).sort().map(dateKey => ({ date: dateKey, total: seriesMap[dateKey] }));

    res.json({ success: true, data: { series, recentClaims: claims.slice(0, 50) } });
  } catch (error) {
    next(error);
  }
};


export const getFounderStats = async (req, res, next) => {
  try {
    const [totalUsers, pendingUsers, totalAdmin, totalFounders, activeCodes, totalCodes, payoutRequests] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { referredBy: { status: 'PENDING' } } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'FOUNDER' } }),
      prisma.founderCode.count({ where: { isActive: true } }),
      prisma.founderCode.count(),
      prisma.payoutRequest.count()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        pendingUsers,
        totalAdmin,
        totalFounders,
        activeCodes,
        totalCodes,
        payoutRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

// Marketing Assets
export const getMarketingAssets = async (req, res, next) => {
  try {
    const assets = await prisma.marketingAsset.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: assets });
  } catch (error) {
    next(error);
  }
};

export const createMarketingAsset = async (req, res, next) => {
  try {
    const { title, type, icon, formats, description, fileUrl, thumbnailUrl } = req.body;
    const asset = await prisma.marketingAsset.create({
      data: {
        title,
        type: type.toUpperCase(),
        icon,
        formats,
        description,
        fileUrl,
        thumbnailUrl
      }
    });
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

export const deleteMarketingAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.marketingAsset.delete({ where: { id } });
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Training Courses
export const getTrainingCourses = async (req, res, next) => {
  try {
    const courses = await prisma.trainingCourse.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

export const createTrainingCourse = async (req, res, next) => {
  try {
    const { title, duration, level, description, focus, thumbnailUrl, videoUrl } = req.body;
    const course = await prisma.trainingCourse.create({
      data: {
        title,
        duration,
        level,
        description,
        focus,
        thumbnailUrl,
        videoUrl
      }
    });
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const deleteTrainingCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.trainingCourse.delete({ where: { id } });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Update admin password
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user ID found'
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // Find admin user
    const user = await prisma.user.findUnique({
      where: { id: adminId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Verify current password
    const { comparePassword } = await import('../utils/password.util.js');
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const { hashPassword } = await import('../utils/password.util.js');
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
}