const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Product.deleteMany({});

    const products = [
        // --- SHOP / SALE products ---
        {
            name: 'Wireless Earbuds Pro',
            image: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&auto=format&fit=crop&q=80',
            description: 'Premium wireless earbuds with active noise cancellation and 30h battery life.',
            category: 'Electronics',
            type: 'sale',
            price: 1299,
            pricePerDay: 0,
            countInStock: 20,
            isAvailable: true
        },
        {
            name: 'Mechanical Keyboard',
            image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
            description: 'RGB backlit mechanical keyboard with cherry MX switches.',
            category: 'Electronics',
            type: 'sale',
            price: 2499,
            pricePerDay: 0,
            countInStock: 15,
            isAvailable: true
        },
        {
            name: 'Running Shoes X-1',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
            description: 'Lightweight and responsive running shoes with cushioned sole.',
            category: 'Footwear',
            type: 'sale',
            price: 3499,
            pricePerDay: 0,
            countInStock: 30,
            isAvailable: true
        },
        {
            name: 'Smart Watch Series 5',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
            description: 'Fitness tracking smart watch with heart rate monitor and GPS.',
            category: 'Wearables',
            type: 'sale',
            price: 5999,
            pricePerDay: 0,
            countInStock: 10,
            isAvailable: true
        },
        {
            name: 'Backpack Explorer 40L',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
            description: 'Durable 40L hiking backpack with ergonomic design and laptop compartment.',
            category: 'Outdoors',
            type: 'sale',
            price: 1899,
            pricePerDay: 0,
            countInStock: 25,
            isAvailable: true
        },
        {
            name: 'Bluetooth Speaker MAX',
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
            description: 'Waterproof portable bluetooth speaker with 360° surround sound.',
            category: 'Electronics',
            type: 'sale',
            price: 2199,
            pricePerDay: 0,
            countInStock: 18,
            isAvailable: true
        },
        // --- RENTAL products ---
        {
            name: 'Mountain Bike X-200',
            image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&auto=format&fit=crop&q=80',
            description: 'Hardtail mountain bike with 21 speeds and front suspension. Perfect for trails.',
            category: 'Bikes',
            type: 'rental',
            price: 0,
            pricePerDay: 350,
            countInStock: 5,
            isAvailable: true
        },
        {
            name: 'Sony A7 III Camera',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
            description: 'Full-frame mirrorless camera with 4K video capabilities. Includes 28-70mm lens.',
            category: 'Electronics',
            type: 'rental',
            price: 0,
            pricePerDay: 1200,
            countInStock: 3,
            isAvailable: true
        },
        {
            name: 'Professional Drill Kit',
            image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
            description: 'Cordless hammer drill with multiple bits and two batteries.',
            category: 'Tools',
            type: 'rental',
            price: 0,
            pricePerDay: 250,
            countInStock: 8,
            isAvailable: true
        },
        {
            name: 'Camping Tent (4-Person)',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=80',
            description: 'Waterproof 4-person tent with easy-setup technology and mesh windows.',
            category: 'Outdoors',
            type: 'rental',
            price: 0,
            pricePerDay: 400,
            countInStock: 6,
            isAvailable: true
        },
        {
            name: 'DJI Mini 3 Drone',
            image: 'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=600&auto=format&fit=crop&q=80',
            description: 'Compact drone with 4K camera, 38-min flight time. Perfect for aerial photography.',
            category: 'Electronics',
            type: 'rental',
            price: 0,
            pricePerDay: 1500,
            countInStock: 2,
            isAvailable: true
        },
        {
            name: 'Kayak Double Seat',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
            description: 'Tandem kayak for two, includes paddles and life jackets.',
            category: 'Outdoors',
            type: 'rental',
            price: 0,
            pricePerDay: 550,
            countInStock: 4,
            isAvailable: true
        },
    ];

    await Product.insertMany(products);
    console.log('✅ Products seeded successfully!');
    process.exit();
}).catch(err => {
    console.error('Seeder error:', err);
    process.exit(1);
});
