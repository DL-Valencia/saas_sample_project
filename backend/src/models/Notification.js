const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Info', 'Success', 'Warning', 'Error'],
        default: 'Info',
    },
    link: String,
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
