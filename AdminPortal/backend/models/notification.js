// bus-tracker-admin-backend/models/notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientType: {
        type: String,
        enum: ['all', 'route', 'bus', 'user'],
        required: true,
    },
    recipientTarget: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientModel', // Dynamic reference
    },
    recipientModel: {
        type: String,
        enum: ['Route', 'Bus', 'User'], // Add User model if you have one
        required: function () {
            return this.recipientType !== 'all';
        },
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser', // Assuming you have an AdminUser model
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'pending'],
        default: 'sent', // Or 'pending' if you implement scheduling
    },
    // Optional: Add fields for scheduling, delivery status to individual users, etc.
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

