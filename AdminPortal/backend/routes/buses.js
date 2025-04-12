// bus-tracker-admin-backend/routes/buses.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/bus');
const Route = require('../models/route'); // Import the Route model

// GET all buses with populated route information
router.get('/', async (req, res) => {

    try {
        const buses = await Bus.find().populate('assignedRoute', 'routeName'); // Populate the 'assignedRoute' field, selecting only 'routeName'
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific bus by ID with populated route information
router.get('/:id', async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id).populate('assignedRoute', 'routeName');
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new bus
router.post('/', async (req, res) => {
    const { registrationNumber, capacity, busName, model, assignedRoute } = req.body;

    // Validate assignedRoute (optional, but good practice)
    if (assignedRoute) {
        const routeExists = await Route.findById(assignedRoute);
        if (!routeExists) {
            return res.status(400).json({ message: 'Invalid route ID' });
        }
    }

    const newBus = new Bus({
        registrationNumber,
        capacity,
        busName,
        model,
        assignedRoute,
    });

    try {
        const savedBus = await newBus.save();
        const populatedBus = await Bus.findById(savedBus._id).populate('assignedRoute', 'routeName'); // Populate after saving to return route name
        res.status(201).json(populatedBus);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Registration number already exists' });
        }
        res.status(400).json({ message: err.message });
    }
});

// PATCH (update) an existing bus by ID
router.patch('/:id', async (req, res) => {
    const { registrationNumber, capacity, busName, model, assignedRoute } = req.body;

    // Validate assignedRoute (optional, but good practice)
    if (assignedRoute) {
        const routeExists = await Route.findById(assignedRoute);
        if (!routeExists) {
            return res.status(400).json({ message: 'Invalid route ID' });
        }
    }

    try {
        const updatedBus = await Bus.findByIdAndUpdate(
            req.params.id,
            { registrationNumber, capacity, busName, model, assignedRoute, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('assignedRoute', 'routeName'); // Populate on update
        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(updatedBus);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Registration number already exists' });
        }
        res.status(400).json({ message: err.message });
    }
});

// DELETE a bus by ID
router.delete('/:id', async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;