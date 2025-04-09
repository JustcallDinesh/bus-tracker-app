// bus-tracker-admin-backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const AdminUser = require('../models/adminUser'); // Assuming you have this model
const Route = require('../models/route');
const Bus = require('../models/bus');

// GET all notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().populate('sentBy', 'username'); // Populate sender info
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new notification
router.post('/', async (req, res) => {
    const { recipientType, recipientTarget, title, body, sentBy } = req.body;

    // Validate sentBy (assuming you have middleware to get the current admin user ID)
    const adminUser = await AdminUser.findById(sentBy);
    if (!adminUser) {
        return res.status(400).json({ message: 'Invalid sender ID.' });
    }

    // Basic validation for recipientTarget based on recipientType
    if (recipientType !== 'all' && !recipientTarget) {
        return res.status(400).json({ message: 'Recipient target is required for the selected recipient type.' });
    }

    let recipientModel;
    if (recipientType === 'route') recipientModel = 'Route';
    else if (recipientType === 'bus') recipientModel = 'Bus';
    else if (recipientType === 'user') recipientModel = 'User'; // Add User if applicable

    const newNotification = new Notification({
        recipientType,
        recipientTarget,
        recipientModel,
        title,
        body,
        sentBy: adminUser._id,
    });

    try {
        const savedNotification = await newNotification.save();
        // In a real application, you would likely trigger the actual sending of the notification here
        console.log('Notification saved:', savedNotification);
        res.status(201).json(savedNotification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
