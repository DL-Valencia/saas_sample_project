const Log = require('../models/Log');

const createLog = async ({ user, action, entity, entityId, details, req }) => {
    try {
        await Log.create({
            user,
            action,
            entity,
            entityId,
            details,
            ipAddress: req ? req.ip : null,
            userAgent: req ? req.headers['user-agent'] : null,
        });
    } catch (error) {
        console.error('Error creating log:', error);
    }
};

module.exports = { createLog };
