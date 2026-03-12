const store = require('../config/store');

function isDBConnected() {
    try { const m = require('mongoose'); return m.connection.readyState === 1; } catch { return false; }
}

const addBookingItems = async (req, res) => {
    const { rentalItems, totalPrice } = req.body;
    if (!rentalItems || !rentalItems.length) return res.status(400).json({ message: 'No rental items' });

    if (isDBConnected()) {
        const Booking = require('../models/bookingModel');
        const booking = new Booking({ rentalItems, user: req.user._id, totalPrice });
        const created = await booking.save();
        store.bookings.push({ _id: created._id, totalPrice, itemCount: rentalItems.length, type: 'rental', createdAt: new Date() });
        return res.status(201).json(created);
    }

    const booking = { _id: `bk_${Date.now()}`, rentalItems, user: req.user?.id || 'guest', totalPrice, status: 'Pending', type: 'rental', createdAt: new Date() };
    store.bookings.push(booking);
    return res.status(201).json(booking);
};

module.exports = { addBookingItems };
