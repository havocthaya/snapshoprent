const Product = require('../models/productModel');

// Sample data for demo when DB is not connected
const sampleProducts = [
    {
        _id: '1',
        name: 'Mountain Bike X-200',
        image: 'https://images.unsplash.com/photo-1532298229144-0ee0c9e910b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Hardtail mountain bike with 21 speeds and front suspension. Perfect for trails.',
        category: 'Bikes',
        pricePerDay: 450,
        isAvailable: true
    },
    {
        _id: '2',
        name: 'Sony A7 III Camera',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Full-frame mirrorless camera with 4K video capabilities. Includes 28-70mm lens.',
        category: 'Electronics',
        pricePerDay: 1200,
        isAvailable: true
    },
    {
        _id: '3',
        name: 'Professional Drill Kit',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Cordless hammer drill with multiple bits and two batteries.',
        category: 'Tools',
        pricePerDay: 300,
        isAvailable: true
    },
    {
        _id: '4',
        name: 'Camping Tent (4-Person)',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Waterproof 4-person tent with easy-setup technology.',
        category: 'Outdoors',
        pricePerDay: 500,
        isAvailable: true
    }
];

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.json(sampleProducts);
    }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        const product = sampleProducts.find(p => p._id === req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
};

module.exports = { getProducts, getProductById };
