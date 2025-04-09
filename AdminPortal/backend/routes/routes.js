const express = require('express');
const router = express.Router();
const Route = require('../models/route');

// GET all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific route by ID
router.get('/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json(route);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new route
router.post('/', async (req, res) => {
    // console.log('Received request body:', req.body);
    const { routeName, origin, destination, stops } = req.body;
    // console.log('Extracted routeName:', routeName);

    const newRoute = new Route({
        routeName: routeName, // Explicitly set it again
        origin: origin,
        destination: destination,
        stops: stops,
    });

    // console.log('New Route object before save:', newRoute); // Log the entire object

    try {
        const savedRoute = await newRoute.save();
        res.status(201).json(savedRoute);
    } catch (err) {
        console.error('Error saving route:', err);
        res.status(400).json({ message: err.message }); // Send the full error message
    }
});

// PATCH (update) an existing route by ID
router.patch('/:id', async (req, res) => {
    try {
        const { routeName, origin, destination, stops } = req.body;
        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            {
                routeName,
                origin,
                destination,
                stops: stops.map(stop => ({ ...stop, _id: undefined })), // Remove _id from existing stops to avoid issues
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found.' });
        }

        res.json(updatedRoute);
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(400).json({ message: error.message }); // Or a more specific error message
    }
});

// DELETE a route by ID
router.delete('/:id', async (req, res) => {
    console.log(req.body);
    try {
        const deletedRoute = await Route.findByIdAndDelete(req.params.id);
        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }
        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;