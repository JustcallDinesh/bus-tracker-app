// bus-tracker-admin-backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

// Route to get notifications (role-based access)
router.get('/', requireAuth, async (req, res) => {
    try {
        let query = {};

        if (req.user.role !== 'superadmin') {
            // Regular admins can only see notifications targeted at 'all' or themselves
            query.$or = [
                { recipientType: 'all' },
                { recipientType: 'user', recipientTarget: req.user._id },
            ];

            // Additionally, they might be interested in notifications related to
            // buses or routes they own. You'll need to join or query based on ownership.
            // This part depends heavily on how ownership is established in your Bus and Route models.

            // Example (assuming 'sentBy' also relates to ownership):
            // query.$or.push({ sentBy: req.user._id });

            // More complex scenarios might require looking up related Buses and Routes.
            // For simplicity in this basic modification, we'll focus on 'all' and 'user' targets.
        }

        const notifications = await Notification.find(query)
            .populate('sentBy', 'username') // Populate sender's username
            .populate('recipientTarget', 'name registrationNumber username'); // Populate the target (Route, Bus, or User)

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

// Route to get a specific notification by ID (role-based access)
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findById(id)
            .populate('sentBy', 'username')
            .populate('recipientTarget');

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (req.user.role === 'superadmin') {
            return res.status(200).json(notification);
        } else {
            // Regular admins can only see notifications targeted at 'all' or themselves
            if (notification.recipientType === 'all' ||
                (notification.recipientType === 'user' && notification.recipientTarget.equals(req.user._id))) {
                return res.status(200).json(notification);
            }
            return res.status(403).json({ message: 'Unauthorized to access this notification' });
        }
    } catch (error) {
        console.error('Error fetching notification by ID:', error);
        res.status(500).json({ message: 'Failed to fetch notification' });
    }
});

// Route to add a new notification (requires authentication and sets sentBy)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { recipientType, recipientTarget, recipientModel, title, body } = req.body;

        const newNotification = new Notification({
            recipientType,
            recipientTarget,
            recipientModel,
            title,
            body,
            sentBy: req.user._id,
        });

        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Failed to create notification' });
    }
});

module.exports = router;
