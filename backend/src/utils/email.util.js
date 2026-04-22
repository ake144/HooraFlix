import nodemailer from 'nodemailer';

const getResetBaseUrl = () => {
    if (process.env.PASSWORD_RESET_URL) {
        return process.env.PASSWORD_RESET_URL;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    return `${frontendUrl}/reset-password`;
};

const buildResetUrl = (token) => {
    const baseUrl = getResetBaseUrl();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}token=${encodeURIComponent(token)}`;
};

const canSendEmail = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_FROM);

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
            : undefined
    });
};

export const sendPasswordResetEmail = async ({ email, name, token }) => {
    const resetUrl = buildResetUrl(token);

    if (!canSendEmail()) {
        console.warn('SMTP is not configured. Password reset email was not sent.');
        console.info(`Password reset link for ${email}: ${resetUrl}`);
        return;
    }

    const transporter = createTransporter();
    const displayName = name || 'there';

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your Hooraflix password',
        text: `Hi ${displayName},\n\nUse this link to reset your password:\n${resetUrl}\n\nThis link expires in 30 minutes.\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Hi ${displayName},</p><p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p><p>If you did not request this, you can ignore this email.</p>`
    });
};
