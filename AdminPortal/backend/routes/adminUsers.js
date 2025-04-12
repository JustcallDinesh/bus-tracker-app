// bus-tracker-admin-backend/routes/adminUsers.js
const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUser');
const { requireAuth, requireSuperAdmin } = require('../middleware/auth');


// Route to get admin users (role-based access)
router.get('/', requireAuth, async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            // Super Admin can see all admin users
            const allAdminUsers = await AdminUser.find().select('-password');
            return res.status(200).json(allAdminUsers);
        } else if (req.user.role === 'admin') {
            // console.log("Regular admin users can only see their own profile");
            const ownProfile = await AdminUser.findById(req.user._id).select('-password');
            if (!ownProfile) {
                return res.status(404).json({ message: 'Your profile not found' });
            }
            return res.status(200).json([ownProfile]); // Send back an array with their own profile
        } else {
            // Other roles (editor, viewer, etc.) might not have access to this route at all
            return res.status(403).json({ message: 'Unauthorized to view admin users' });
        }
    } catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).json({ message: 'Failed to fetch admin users' });
    }
});


// POST a new admin user
// Route to create a new admin user (requires Super Admin authentication)
router.post('/', requireAuth, requireSuperAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;

    // Basic role validation (optional, but good to have)
    if (!['superadmin', 'admin', 'editor', 'viewer'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    try {
        const existingUser = await AdminUser.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const newAdminUser = new AdminUser({
            username,
            email,
            password,
            role,
            approvedBySuperAdmin: req.user.role === 'superadmin', // Super admins auto-approve
        });

        const savedAdminUser = await newAdminUser.save();
        res.status(201).json(savedAdminUser);
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ message: 'Failed to create admin user' });
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


// Route to get all unapproved admin users (requires Super Admin authentication)
router.get('/unapproved', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const unapprovedUsers = await AdminUser.find({ approvedBySuperAdmin: false });
        res.status(200).json(unapprovedUsers);
    } catch (error) {
        console.error('Error fetching unapproved users:', error);
        res.status(500).json({ message: 'Failed to fetch unapproved users' });
    }
});

// Route to approve or reject an admin user (requires Super Admin authentication)
router.patch('/:id/approval', requireAuth, requireSuperAdmin, async (req, res) => {
    const { approved } = req.body; // Expecting a boolean 'approved' in the request body
    const { id } = req.params;

    try {
        const userToUpdate = await AdminUser.findByIdAndUpdate(
            id,
            { approvedBySuperAdmin: approved },
            { new: true } // Return the updated document
        );

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: `User ${approved ? 'approved' : 'rejected'} successfully`, user: userToUpdate });
    } catch (error) {
        console.error('Error approving/rejecting user:', error);
        res.status(500).json({ message: 'Failed to approve/reject user' });
    }
});



module.exports = router;