// bus-tracker-admin-backend/createSuperAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('./models/adminUser');

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB Connected for Super Admin Creation');

        const superAdminExists = await AdminUser.findOne({ role: 'superadmin' });
        if (superAdminExists) {
            console.log('Super Admin account already exists.');
            mongoose.disconnect();
            return;
        }

        const superAdminData = {
            username: 'superadminDinesh', // **CHANGE THIS** to your desired username
            email: 'superadmin41@gmail.com', // **CHANGE THIS** to your desired email
            password: 'super@admin41', // **CHANGE THIS** to a STRONG and UNIQUE password
            role: 'superadmin',
            approvedBySuperAdmin: true,
        };

        const newSuperAdmin = new AdminUser(superAdminData);

        try {
            const savedSuperAdmin = await newSuperAdmin.save();
            console.log('Super Admin account created successfully:', savedSuperAdmin);
        } catch (error) {
            console.error('Error creating Super Admin account:', error);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Could not connect to MongoDB:', err));
