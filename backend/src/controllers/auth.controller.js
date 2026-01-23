import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    getRefreshTokenExpiry
} from '../utils/jwt.util.js';

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, name, refId } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER'
            }
        });

        // If there's a referral ID, create referral relationship
        if (refId) {
            try {
                // Find the founder by their referral link or founder ID
                const founder = await prisma.founder.findFirst({
                    where: {
                        OR: [
                            { id: refId },
                            { referralLink: { contains: refId } }
                        ]
                    }
                });

                if (founder) {
                    await prisma.referral.create({
                        data: {
                            founderId: founder.id,
                            referredUserId: user.id,
                            status: 'ACTIVE'
                        }
                    });
                }
            } catch (error) {
                console.error('Error creating referral:', error);
                // Don't fail registration if referral creation fails
            }
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry()
            }
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    isFounder: user.isFounder
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { founder: true }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id, user.email, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: getRefreshTokenExpiry()
            }
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    isFounder: user.isFounder,
                    founderId: user.founder?.id
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if refresh token exists in database
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!storedToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Check if token is expired
        if (new Date() > storedToken.expiresAt) {
            await prisma.refreshToken.delete({
                where: { id: storedToken.id }
            });
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role
        );

        res.json({
            success: true,
            data: { accessToken }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logout user
 */
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken }
            });
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isFounder: true,
                createdAt: true,
                founder: {
                    select: {
                        id: true,
                        rank: true,
                        totalEarnings: true,
                        referralLink: true,
                        joinDate: true
                    }
                }
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
