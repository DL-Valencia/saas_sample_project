const Notification = require('../models/Notification');

const createNotification = async ({ recipient, sender, title, message, type, link }) => {
    try {
        await Notification.create({
            recipient,
            sender,
            title,
            message,
            type: type || 'Info',
            link,
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = { createNotification };
