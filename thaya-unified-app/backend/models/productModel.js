const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true, enum: ['sale', 'rental'], default: 'sale' },
    price: { type: Number, required: true, default: 0 }, // For Sale
    pricePerDay: { type: Number, default: 0 }, // For Rental
    countInStock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, required: true, default: true }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
