// ── Demo products used when MongoDB is not connected ──
const demoProducts = [
    { _id:'s1', name:'Wireless Earbuds Pro', image:'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80', description:'Premium wireless earbuds with ANC and 30h battery.', category:'Electronics', type:'sale', price:1299, pricePerDay:0, countInStock:20, isAvailable:true },
    { _id:'s2', name:'Mechanical Keyboard',  image:'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80', description:'RGB backlit mechanical keyboard with cherry MX switches.', category:'Electronics', type:'sale', price:2499, pricePerDay:0, countInStock:15, isAvailable:true },
    { _id:'s3', name:'Running Shoes X-1',    image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', description:'Lightweight running shoes with cushioned sole.', category:'Footwear', type:'sale', price:3499, pricePerDay:0, countInStock:30, isAvailable:true },
    { _id:'s4', name:'Smart Watch Series 5', image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', description:'Fitness tracking smart watch with heart rate and GPS.', category:'Wearables', type:'sale', price:5999, pricePerDay:0, countInStock:10, isAvailable:true },
    { _id:'s5', name:'Backpack Explorer 40L',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', description:'Durable 40L hiking backpack with ergonomic design.', category:'Outdoors', type:'sale', price:1899, pricePerDay:0, countInStock:25, isAvailable:true },
    { _id:'s6', name:'Bluetooth Speaker MAX',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80', description:'Waterproof portable speaker with 360° surround sound.', category:'Electronics', type:'sale', price:2199, pricePerDay:0, countInStock:18, isAvailable:true },
    { _id:'r1', name:'Mountain Bike X-200',  image:'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80', description:'Hardtail mountain bike with 21 speeds and front suspension.', category:'Bikes', type:'rental', price:0, pricePerDay:350, countInStock:5, isAvailable:true },
    { _id:'r2', name:'Sony A7 III Camera',   image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', description:'Full-frame mirrorless 4K camera. Includes 28-70mm lens.', category:'Electronics', type:'rental', price:0, pricePerDay:1200, countInStock:3, isAvailable:true },
    { _id:'r3', name:'Professional Drill Kit',image:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80', description:'Cordless hammer drill with multiple bits and two batteries.', category:'Tools', type:'rental', price:0, pricePerDay:250, countInStock:8, isAvailable:true },
    { _id:'r4', name:'Camping Tent (4-Person)',image:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80', description:'Waterproof 4-person tent with easy-setup technology.', category:'Outdoors', type:'rental', price:0, pricePerDay:400, countInStock:6, isAvailable:true },
    { _id:'r5', name:'DJI Mini 3 Drone',     image:'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&auto=format&fit=crop&q=80', description:'Compact drone with 4K camera, 38-min flight time.', category:'Electronics', type:'rental', price:0, pricePerDay:1500, countInStock:2, isAvailable:true },
    { _id:'r6', name:'Kayak Double Seat',    image:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80', description:'Tandem kayak for two. Includes paddles and life jackets.', category:'Outdoors', type:'rental', price:0, pricePerDay:550, countInStock:4, isAvailable:true },
];

// In-memory store (for additions when no DB)
const memProducts = [...demoProducts];

function isDBConnected() {
    try {
        const mongoose = require('mongoose');
        return mongoose.connection.readyState === 1;
    } catch { return false; }
}

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    const { type, category } = req.query;

    if (isDBConnected()) {
        const Product = require('../models/productModel');
        let query = {};
        if (type) query.type = type;
        if (category && category !== 'All') query.category = category;
        const products = await Product.find(query);
        return res.json(products);
    }

    // In-memory fallback
    let products = memProducts;
    if (type) products = products.filter(p => p.type === type);
    if (category && category !== 'All') products = products.filter(p => p.category === category);
    return res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    if (isDBConnected()) {
        const Product = require('../models/productModel');
        const product = await Product.findById(req.params.id);
        if (product) return res.json(product);
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = memProducts.find(p => p._id === req.params.id);
    if (product) return res.json(product);
    return res.status(404).json({ message: 'Product not found' });
};

// @desc    Create a product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
    const { name, image, description, category, type, price, pricePerDay, countInStock } = req.body;

    if (isDBConnected()) {
        const Product = require('../models/productModel');
        const product = await Product.create({ name, image, description, category, type, price: price||0, pricePerDay: pricePerDay||0, countInStock: countInStock||0 });
        return res.status(201).json(product);
    }

    const newProduct = { _id: `mem_${Date.now()}`, name, image, description, category, type, price: price||0, pricePerDay: pricePerDay||0, countInStock: countInStock||0, isAvailable: true };
    memProducts.push(newProduct);
    return res.status(201).json(newProduct);
};

// @desc    Delete a product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    if (isDBConnected()) {
        const Product = require('../models/productModel');
        const product = await Product.findById(req.params.id);
        if (product) { await product.deleteOne(); return res.json({ message: 'Product removed' }); }
        return res.status(404).json({ message: 'Product not found' });
    }

    const idx = memProducts.findIndex(p => p._id === req.params.id);
    if (idx !== -1) { memProducts.splice(idx, 1); return res.json({ message: 'Product removed' }); }
    return res.status(404).json({ message: 'Product not found' });
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };
