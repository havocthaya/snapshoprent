const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Models
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

dotenv.config();

const exportData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database for export...');

        const exportDir = path.join(__dirname, 'database');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir);
        }

        const collections = [
            { name: 'users', model: User, table: 'users' },
            { name: 'products', model: Product, table: 'products' },
            { name: 'orders', model: Order, table: 'orders' }
        ];

        for (const coll of collections) {
            const data = await coll.model.find({});
            let sqlContent = `-- SQL Dump for ${coll.name}\n-- Generated at ${new Date().toLocaleString()}\n\n`;

            if (data.length > 0) {
                // Simplified SQL generation
                data.forEach(item => {
                    const columns = Object.keys(item._doc).filter(k => k !== '__v');
                    const values = columns.map(col => {
                        const val = item._doc[col];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                        return val;
                    });
                    sqlContent += `INSERT INTO ${coll.table} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
                });
            } else {
                sqlContent += `-- No data found for ${coll.name}\n`;
            }

            fs.writeFileSync(
                path.join(exportDir, `${coll.name}.sql`),
                sqlContent
            );
            console.log(`Exported ${coll.name} to database/${coll.name}.sql`);

            // Cleanup old json if exists
            const jsonPath = path.join(exportDir, `${coll.name}.json`);
            if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
        }

        console.log('\nSuccess! You can now see the "database_view" folder in your File Explorer.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

exportData();
