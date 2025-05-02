const express = require('express');
const router = express.Router();
const Route = require('../models/route');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');

// GET all routes (role-based access)
router.get('/', requireAuth, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            const allRoutes = await Route.find();
            return res.status(200).json(allRoutes);
        } else if (req.user.role === 'admin') {
            const userRoutes = await Route.find({ owner: req.user._id });
            return res.status(200).json(userRoutes);
        } else {
            return res.status(403).json({ message: 'Unauthorized to access route data' });
        }
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Failed to fetch routes' });
    }
});

// Route to get a specific route by ID (role-based access)
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const route = await Route.findById(id);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        if (req.user.role === 'superadmin') {
            return res.status(200).json(route);
        } else if (req.user.role === 'admin') {
            if (route.owner.toString() === req.user._id.toString()) {
                return res.status(200).json(route);
            } else {
                return res.status(403).json({ message: 'Unauthorized to access this route' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to access route data' });
        }
    } catch (error) {
        console.error('Error fetching route by ID:', error);
        res.status(500).json({ message: 'Failed to fetch route' });
    }
});

// Route to add a new route (requires authentication and sets owner)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { routeName, trips } = req.body;

        const newRoute = new Route({
            routeName,
            trips,
            owner: req.user._id,
        });

        const savedRoute = await newRoute.save();
        res.status(201).json(savedRoute);
    } catch (error) {
        console.error('Error creating route:', error);
        res.status(500).json({ message: 'Failed to create route' });
    }
});

// PATCH (update) an existing route by ID
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const { routeName, trips } = req.body;
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({ message: 'Route not found.' });
        }

        // Authorization check for admin users
        if (req.user.role === 'admin' && route.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to update this route.' });
        }

        const updatedRoute = await Route.findByIdAndUpdate(
            req.params.id,
            {
                routeName,
                trips,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        res.json(updatedRoute);
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(400).json({ message: error.message }); // Or a more specific error message
    }
});

// DELETE a route by ID
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        // Authorization check for admin users
        if (req.user.role === 'admin' && route.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized to delete this route.' });
        }

        const deletedRoute = await Route.findByIdAndDelete(req.params.id);

        res.json({ message: 'Route deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
