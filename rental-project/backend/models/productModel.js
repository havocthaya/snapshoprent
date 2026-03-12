const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, required: true, default: true }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
