import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

/**
 * Get refresh token expiry date
 * @returns {Date} Expiry date (7 days from now)
 */
export const getRefreshTokenExpiry = () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now;
};
