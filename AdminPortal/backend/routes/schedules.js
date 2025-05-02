// bus-tracker-admin-backend/routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const Route = require('../models/route');
const Bus = require('../models/bus'); // Optional, if you use assignedBus
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

// Route to get schedules (role-based access)
router.get('/', requireAuth, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            // Super Admin can see all schedules
            const allSchedules = await Schedule.find();
            return res.status(200).json(allSchedules);
        } else if (req.user.role === 'admin') {
            // Regular admin users can only see their schedules
            // Assuming a 'owner' field in the Schedule model referencing AdminUser
            const userSchedules = await Schedule.find({ owner: req.user._id });
            return res.status(200).json(userSchedules);
        } else {
            return res.status(403).json({ message: 'Unauthorized to access schedule data' });
        }
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Failed to fetch schedules' });
    }
});

// Route to get a specific schedule by ID (role-based access)
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await Schedule.findById(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        if (req.user.role === 'superadmin') {
            return res.status(200).json(schedule);
        } else if (req.user.role === 'admin') {
            // Ensure the schedule belongs to the logged-in admin user
            if (schedule.owner.toString() === req.user._id.toString()) {
                return res.status(200).json(schedule);
            } else {
                return res.status(403).json({ message: 'Unauthorized to access this schedule' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to access schedule data' });
        }
    } catch (error) {
        console.error('Error fetching schedule by ID:', error);
        res.status(500).json({ message: 'Failed to fetch schedule' });
    }
});

// Route to add a new schedule (requires authentication and sets owner)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { route, departureTimes, daysOfWeek, assignedBus, startDate, endDate, notes } = req.body;

        const newSchedule = new Schedule({
            route,
            departureTimes,
            daysOfWeek,
            assignedBus,
            startDate,
            endDate,
            notes,
            owner: req.user._id,
        });

        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Failed to create schedule' });
    }
});


// PATCH (update) an existing schedule by ID
router.patch('/:id', requireAuth, async (req, res) => {
    const { route, departureTimes, daysOfWeek, assignedBus, startDate, endDate, notes } = req.body;

    // Validate route ID if provided
    if (route) {
        const existingRoute = await Route.findById(route);
        if (!existingRoute) {
            return res.status(400).json({ message: 'Invalid route ID.' });
        }
    }

    // Optional: Validate bus ID if provided
    if (assignedBus) {
        const existingBus = await Bus.findById(assignedBus);
        if (!existingBus) {
            return res.status(400).json({ message: 'Invalid bus ID.' });
        }
    }

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            { route, departureTimes, daysOfWeek, assignedBus, startDate, endDate, notes, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('route', 'routeName').populate('assignedBus', 'registrationNumber');

        if (!updatedSchedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }
        res.json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a schedule by ID
router.delete('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
