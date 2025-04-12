// bus-tracker-admin-backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUser');

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log("AuthHeader", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await AdminUser.findById(decoded.id).select('-password'); // Exclude password for security
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
};

const requireSuperAdmin = requireRole('superadmin');
const requireAdmin = requireRole('superadmin', 'admin'); // Admins can also potentially manage (depending on your logic)
const requireEditor = requireRole('superadmin', 'admin', 'editor');
const requireViewer = requireRole('superadmin', 'admin', 'editor', 'viewer');

module.exports = { requireAuth, requireRole, requireSuperAdmin, requireAdmin, requireEditor, requireViewer };
