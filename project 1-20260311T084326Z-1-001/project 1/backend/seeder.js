const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleProducts = [
    {
        name: 'Sony Noise Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Industry leading noise cancellation technology means you hear every word, note, and tune with incredible clarity.',
        price: 24990
    },
    {
        name: 'Apple MacBook Pro M3',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'The most powerful MacBook ever. Supercharged by M3 Pro or M3 Max, MacBook Pro takes its power and efficiency further than ever.',
        price: 169900
    },
    {
        name: 'Canon EOS R5 Mirrorless Camera',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Rethink what you know about mirrorless cameras. The EOS R5 uncompromising performance will revolutionize your photography.',
        price: 339995
    },
    {
        name: 'Nike Air Max 270 React',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Nike\'s first lifestyle Air Max meets the softest, smoothest and most resilient foam yet in the Nike Air Max 270 React.',
        price: 12995
    },
    {
        name: 'Amazon Echo Dot (4th Gen)',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Meet the all-new Echo Dot. Our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass.',
        price: 4499
    },
    {
        name: 'Logitech MX Master 3 Wireless Mouse',
        image: 'https://images.unsplash.com/photo-1527814050087-379381547996?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'MagSpeed Electromagnetic scrolling is precise enough to stop on a pixel and quick enough to scroll 1,000 lines in a second.',
        price: 8995
    }
];

const importData = async () => {
    try {
        await Product.deleteMany();
        console.log('Old products cleared.');

        await Product.insertMany(sampleProducts);
        console.log('New premium sample products added successfully!');
        
        process.exit();
    } catch (error) {
        console.error(`Error with seeder: ${error.message}`);
        process.exit(1);
    }
};

importData();
