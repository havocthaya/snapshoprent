const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
    // Sync database to local folder for File Explorer visibility
    try {
        const exportDir = path.join(__dirname, 'database');
        if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

        const models = { users: User, products: Product, orders: Order };
        for (const [name, Model] of Object.entries(models)) {
            const data = await Model.find({});
            let sqlContent = `-- SQL Dump for ${name}\n-- Generated at ${new Date().toLocaleString()}\n\n`;

            if (data.length > 0) {
                data.forEach(item => {
                    const columns = Object.keys(item._doc).filter(k => k !== '__v');
                    const values = columns.map(col => {
                        const val = item._doc[col];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                        return val;
                    });
                    sqlContent += `INSERT INTO ${name} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
                });
            }

            fs.writeFileSync(path.join(exportDir, `${name}.sql`), sqlContent);

            // Cleanup old json
            const jsonPath = path.join(exportDir, `${name}.json`);
            if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
        }
        console.log('Database synchronization to /database folder complete (SQL format).');
    } catch (err) {
        console.error('Initial sync failed:', err.message);
    }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use API Routes first!
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for any other request
app.use((req, res, next) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
