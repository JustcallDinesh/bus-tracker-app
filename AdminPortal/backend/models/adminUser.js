// bus-tracker-admin-backend/models/adminUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: { // Changed 'roles' to a single 'role' for simplicity in basic role checking
        type: String,
        enum: ['superadmin', 'admin', 'editor', 'viewer'],
        default: 'viewer',
        required: true,
    },
    approvedBySuperAdmin: {
        type: Boolean,
        default: false, // Admins and Editors might need approval
    },
    ownerId: { // Optional: Link to the bus owner
        type: mongoose.Schema.Types.ObjectId,
        ref: '/* Your Bus Owner Model Name */',
        default: null, // Set default to null if not linked initially

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
// Hash the password before saving
adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;