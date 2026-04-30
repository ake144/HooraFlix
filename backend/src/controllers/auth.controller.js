import prisma from '../config/database.js';
import { createHash, randomBytes } from 'crypto';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { sendPasswordResetEmail } from '../utils/email.util.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    getRefreshTokenExpiry
} from '../utils/jwt.util.js';

const PASSWORD_RESET_EXPIRY_MINUTES = 30;
const RESET_PASSWORD_RESPONSE_MESSAGE = 'If an account exists with that email, a password reset link has been sent.';

const getPasswordResetExpiry = () => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + PASSWORD_RESET_EXPIRY_MINUTES);
    return expiry;
};

const hashResetToken = (token) => createHash('sha256').update(token).digest('hex');

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

        try {
            verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                await prisma.refreshToken.deleteMany({
                    where: { token: refreshToken }
                });

                return res.status(401).json({
                    success: false,
                    message: 'Session expired. Please login again.'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }

            throw error;
        }

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

        // Rotate refresh token: generate a new refresh token and update DB
        const newRefreshToken = generateRefreshToken(storedToken.user.id);
        try {
            await prisma.refreshToken.update({
                where: { id: storedToken.id },
                data: { token: newRefreshToken, expiresAt: getRefreshTokenExpiry() }
            });
        } catch (err) {
            // If update fails, log and continue returning at least the access token
            console.error('Failed to rotate refresh token for user', storedToken.user.id, err);
        }

        res.json({
            success: true,
            data: { accessToken, refreshToken: newRefreshToken }
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


export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.json({
                success: true,
                message: RESET_PASSWORD_RESPONSE_MESSAGE
            });
        }

        const rawToken = randomBytes(32).toString('hex');
        const tokenHash = hashResetToken(rawToken);

        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

        await prisma.passwordResetToken.create({
            data: {
                token: tokenHash,
                userId: user.id,
                expiresAt: getPasswordResetExpiry()
            }
        });

        await sendPasswordResetEmail({
            email: user.email,
            name: user.name,
            token: rawToken
        });

        res.json({
            success: true,
            message: RESET_PASSWORD_RESPONSE_MESSAGE
        });
    } catch (error) {
        next(error);
    }
};


export const resetPassword = async (req, res, next)=>{
    try{
        const { token, password } = req.body;
        const tokenHash = hashResetToken(token);

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token: tokenHash },
            include: { user: true }
        });

        if(!resetToken || new Date() > resetToken.expiresAt){
            if (resetToken) {
                await prisma.passwordResetToken.delete({
                    where: { id: resetToken.id }
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        const hashedPassword = await hashPassword(password);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId: resetToken.userId }
            }),
            prisma.refreshToken.deleteMany({
                where: { userId: resetToken.userId }
            })
        ]);

        res.json({
            success: true,
            message: 'Password reset successful. Please log in with your new password.'
        });

    }
    catch(error){
        next(error);
    }
};
