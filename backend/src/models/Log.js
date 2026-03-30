const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    entity: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose.Schema.ObjectId,
    },
    details: {
        type: String,
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true,
});

logSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);
