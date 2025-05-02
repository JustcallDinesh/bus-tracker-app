// bus-tracker-admin-backend/routes/auth.js (or adminUsers.js - TEMPORARY)
const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//Function To generate a refresh token 

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

// TEMPORARY LOGIN ROUTE FOR TESTING SUPER ADMIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await AdminUser.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Short expiration
        const refreshToken = generateRefreshToken();
        user.refreshToken = refreshToken; // Store refresh token in database
        await user.save();

        res.json({ accessToken, refreshToken, user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});

// New /refresh route
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const user = await AdminUser.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // In a real application, you might want to verify the refresh token's signature as well
        // using a separate secret or a more robust mechanism.

        const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = generateRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Failed to refresh token' });
    }
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const ExistingUser = await AdminUser.findOne({ $or: [{ username }, { email }] });
        if (ExistingUser) {
            return res.status(409).json({ message: "Username or Email already Exist" });
        }

        const newUser = new AdminUser({
            username,
            email,
            password,
            role: 'admin',//Default
            approvedBySuperAdmin: false

        });
        await newUser.save();
        res.status(201).json({ message: "Registration Succeessfull. Your Account is Pending to approval." })
    } catch (error) {
        console.error('Registeration Error:', error);
        res.status(500).json({ message: "Registeration Failed" });
    }
});

module.exports = router;
