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
