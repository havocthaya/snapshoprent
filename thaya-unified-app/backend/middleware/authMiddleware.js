const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'thaya_secret_key_12345');
            
            // Try DB first
            try {
                const mongoose = require('mongoose');
                if (mongoose.connection.readyState === 1) {
                    req.user = await User.findById(decoded.id).select('-password');
                }
            } catch (e) {
                // DB failed or not connected
            }

            // Fallback for Admin or In-memory users
            if (!req.user) {
                const store = require('../config/store');
                // Check if it's the hardcoded admin
                if (decoded.id === 'admin_root') {
                    req.user = { id: 'admin_root', name: 'Gopi', email: 'gopi', isAdmin: true };
                } else {
                    const found = store.users.find(u => u.id === decoded.id || u._id === decoded.id);
                    if (found) req.user = found;
                }
            }

            if (!req.user) throw new Error('User not found');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
