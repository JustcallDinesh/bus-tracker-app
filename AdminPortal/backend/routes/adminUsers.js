// bus-tracker-admin-backend/routes/adminUsers.js
const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUser');

// GET all admin users
router.get('/', async (req, res) => {
    try {
        const adminUsers = await AdminUser.find().select('-password');
        res.json(adminUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new admin user
router.post('/', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Only superadmins can create users with roles other than 'viewer'
    let assignedRole = 'viewer';
    if (req.user.role === 'superadmin' && role && ['superadmin', 'admin', 'editor', 'viewer'].includes(role)) {
        assignedRole = role;
    }

    const newAdminUser = new AdminUser({
        username,
        email,
        password,
        role: assignedRole,
        approvedBySuperAdmin: req.user.role === 'superadmin', // Super admins auto-approve
    });

    try {
        const savedAdminUser = await newAdminUser.save();
        res.status(201).json({
            _id: savedAdminUser._id,
            username: savedAdminUser.username,
            email: savedAdminUser.email,
            role: savedAdminUser.role,
            approvedBySuperAdmin: savedAdminUser.approvedBySuperAdmin,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(400).json({ message: err.message });
    }
});

// GET a specific admin user by ID
router.get('/:id', async (req, res) => {
    try {
        const adminUser = await AdminUser.findById(req.params.id).select('-password');
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }
        res.json(adminUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE an admin user by ID
router.delete('/:id', async (req, res) => {
    try {
        const adminUser = await AdminUser.findByIdAndDelete(req.params.id);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH (update) an existing admin user by ID


module.exports = router;
