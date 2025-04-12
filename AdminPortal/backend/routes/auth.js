// bus-tracker-admin-backend/routes/auth.js (or adminUsers.js - TEMPORARY)
const express = require('express');
const router = express.Router();
const AdminUser = require('../models/adminUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// TEMPORARY LOGIN ROUTE FOR TESTING SUPER ADMIN
router.post('/login', async (req, res) => {
    console.log("function Executed");
    const { username, password } = req.body;

    try {
        const user = await AdminUser.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password); // Using the comparePassword method from the model
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiry as needed

        res.json({ token, user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
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
