const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);

// Static frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.use((req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Rental Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
