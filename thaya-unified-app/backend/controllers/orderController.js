const store = require('../config/store');

function isDBConnected() {
    try { const m = require('mongoose'); return m.connection.readyState === 1; } catch { return false; }
}

const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!orderItems || !orderItems.length) return res.status(400).json({ message: 'No order items' });

    if (isDBConnected()) {
        const Order = require('../models/orderModel');
        const order = new Order({ orderItems, user: req.user._id, shippingAddress, paymentMethod, totalPrice });
        const created = await order.save();
        store.orders.push({ _id: created._id, totalPrice, itemCount: orderItems.length, type: 'sale', createdAt: new Date() });
        return res.status(201).json(created);
    }

    const order = { _id: `ord_${Date.now()}`, orderItems, user: req.user?.id || 'guest', shippingAddress, paymentMethod, totalPrice, type: 'sale', createdAt: new Date() };
    store.orders.push(order);
    return res.status(201).json(order);
};

module.exports = { addOrderItems };
