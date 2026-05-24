import prisma from '../config/database.js';

/**
 * Log an activity to the ActivityLog table.
 * Non-blocking: failures are caught and logged to console.
 * @param {string} type - Short activity type (e.g. NEW_USER, UPLOAD)
 * @param {string|null} meta - Optional short meta/label
 */
export const logActivity = async (type, meta = null) => {
    try {
        await prisma.activityLog.create({
            data: {
                type: String(type).toUpperCase(),
                meta: meta ? String(meta) : null,
            }
        });
    } catch (err) {
        // Do not throw - logging should not break main flow
        console.error('Activity logger failed:', err);
    }
};

export default { logActivity };
