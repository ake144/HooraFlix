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
