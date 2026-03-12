const express = require('express');
const router  = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const store = require('../config/store');

// GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
    let stats = {
        totalOrders:   0,
        totalBookings: 0,
        totalRevenue:  0,
        totalUsers:    0,
        totalProducts: 0,
        recentOrders:  [],
        recentBookings:[],
        monthlySales:  [],
    };

    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState === 1) {
            const Order   = require('../models/orderModel');
            const Booking = require('../models/bookingModel');
            const User    = require('../models/userModel');
            const Product = require('../models/productModel');

            const [orders, bookings, users, products] = await Promise.all([
                Order.find({}).sort({ createdAt: -1 }),
                Booking.find({}).sort({ createdAt: -1 }),
                User.countDocuments(),
                Product.countDocuments(),
            ]);

            stats.totalOrders   = orders.length;
            stats.totalBookings = bookings.length;
            stats.totalRevenue  = [...orders, ...bookings].reduce((s, o) => s + (o.totalPrice || 0), 0);
            stats.totalUsers    = users;
            stats.totalProducts = products;
            stats.recentOrders  = orders.slice(0, 5);
            stats.recentBookings= bookings.slice(0, 5);
        } else {
            throw new Error('no db');
        }
    } catch {
        // In-memory fallback
        const allTx = [...store.orders, ...store.bookings];
        stats.totalOrders   = store.orders.length;
        stats.totalBookings = store.bookings.length;
        stats.totalRevenue  = allTx.reduce((s, o) => s + (o.totalPrice || 0), 0);
        stats.totalUsers    = store.users.length;
        stats.totalProducts = 12; // demo products count
        stats.recentOrders  = store.orders.slice(-5).reverse();
        stats.recentBookings= store.bookings.slice(-5).reverse();

        // Monthly revenue (last 6 months)
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const now = new Date();
        stats.monthlySales = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return { month: months[d.getMonth()], revenue: Math.floor(Math.random() * 15000) + 2000 };
        });
    }

    res.json(stats);
});

module.exports = router;
