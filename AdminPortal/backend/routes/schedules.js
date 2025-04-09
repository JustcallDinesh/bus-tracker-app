// bus-tracker-admin-backend/routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');
const Route = require('../models/route');
const Bus = require('../models/bus'); // Optional, if you use assignedBus

// GET all schedules (populate route and optional bus)
router.get('/', async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('route', 'routeName').populate('assignedBus', 'registrationNumber');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET schedules for a specific route
router.get('/route/:routeId', async (req, res) => {
    try {
        const schedules = await Schedule.find({ route: req.params.routeId }).populate('route', 'routeName').populate('assignedBus', 'registrationNumber');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific schedule by ID (populate route and optional bus)
router.get('/:id', async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate('route', 'routeName').populate('assignedBus', 'registrationNumber');
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new schedule
router.post('/', async (req, res) => {
    const { route, departureTimes, daysOfWeek, assignedBus, startDate, endDate, notes } = req.body;

    // Validate route ID
    const existingRoute = await Route.findById(route);
    if (!existingRoute) {
        return res.status(400).json({ message: 'Invalid route ID.' });
    }

    // Optional: Validate bus ID if provided
    if (assignedBus) {
        const existingBus = await Bus.findById(assignedBus);
        if (!existingBus) {
            return res.status(400).json({ message: 'Invalid bus ID.' });
        }
    }

    const newSchedule = new Schedule({
        route,
        departureTimes,
        daysOfWeek,
        assignedBus,
        startDate,
        endDate,
        notes,
    });

    try {
        const savedSchedule = await newSchedule.save();
        res.status(201).json(savedSchedule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH (update) an existing schedule by ID
router.patch('/:id', async (req, res) => {
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
