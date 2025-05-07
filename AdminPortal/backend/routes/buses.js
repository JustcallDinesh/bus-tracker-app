// bus-tracker-admin-backend/routes/buses.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/bus');
const Route = require('../models/route'); // Import the Route model
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');


// Route to get buses (role-based access)
router.get('/', requireAuth, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            // Super Admin can see all buses
            const allBuses = await Bus.find();
            return res.status(200).json(allBuses);
        } else if (req.user.role === 'admin') {
            // Regular admin users (e.g., bus owners/operators) can only see their buses
            // You'll need a way to associate buses with admin users (e.g., a 'owner' field in the Bus model referencing the AdminUser)
            const userBuses = await Bus.find({ owner: req.user._id }).populate("assignedRoute");
            return res.status(200).json(userBuses);
        } else {
            return res.status(403).json({ message: 'Unauthorized to access bus data' });
        }
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ message: 'Failed to fetch buses' });
    }
});

// Route to get a specific bus by ID (role-based access)
router.get('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const bus = await Bus.findById(id);
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        if (req.user.role === 'superadmin') {
            return res.status(200).json(bus);
        } else if (req.user.role === 'admin') {
            // Ensure the bus belongs to the logged-in admin user
            if (bus.owner.toString() === req.user._id.toString()) {
                return res.status(200).json(bus);
            } else {
                return res.status(403).json({ message: 'Unauthorized to access this bus' });
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized to access bus data' });
        }
    } catch (error) {
        console.error('Error fetching bus by ID:', error);
        res.status(500).json({ message: 'Failed to fetch bus' });
    }
});

// GET a specific bus by ID with populated route information
router.get('/:id', requireAuth, async (req, res) => {
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
router.post('/', requireAuth, async (req, res) => {
    const { busNumber, busTypegvt, capacity, busName, model, assignedRoute } = req.body;
    // console.log(req.body);

    // Validate assignedRoute (optional, but good practice)
    if (assignedRoute) {
        const routeExists = await Route.findById(assignedRoute);
        if (!routeExists) {
            return res.status(400).json({ message: 'Invalid route ID' });
        }
    }



    const newBus = new Bus({
        busNumber,
        capacity,
        busName,
        model,
        assignedRoute,
        busTypegvt,
        owner: req.user._id,
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
router.patch('/:id', requireAuth, async (req, res) => {
    const { busNumber, isGovernt, busTypegvt, capacity, busName, model, assignedRoute, } = req.body;

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
            { busNumber, isGovernt, capacity, busName, model, assignedRoute, busTypegvt, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('assignedRoute', 'routeName'); // Populate on update
        if (!updatedBus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(updatedBus);
    } catch (err) {
        console.log(err.message);
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