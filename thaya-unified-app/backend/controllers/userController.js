const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const store = require('../config/store');

// ─── Fixed Admin Account ────────────────────────────────
// Only ONE admin can log in — credentials are locked here.
const ADMIN = {
    id: 'admin_root',
    name: 'Gopi Admin',
    email: 'gopi123', // Admin Username/ID
    password: '123456',
    isAdmin: true,
};

let adminPasswordReady = false;
async function ensureAdminPassword() {
    if (!adminPasswordReady) {
        const salt = await bcrypt.genSalt(10);
        ADMIN.password = await bcrypt.hash('123456', salt);
        adminPasswordReady = true;
    }
}

function isDBConnected() {
    try { const m = require('mongoose'); return m.connection.readyState === 1; } catch { return false; }
}

const JWT_SECRET = process.env.JWT_SECRET || 'thaya_secret_key_12345';

const generateToken = (id, isAdmin) =>
    jwt.sign({ id, isAdmin }, JWT_SECRET, { expiresIn: '30d' });

function buildRes(user) {
    return {
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
        token: generateToken(user._id || user.id, user.isAdmin),
    };
}

// ─── POST /api/users/login ──────────────────────────────
const authUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    await ensureAdminPassword();

    // Admin check first (always works regardless of DB)
    if (email === ADMIN.email) {
        const match = await bcrypt.compare(password, ADMIN.password);
        if (!match) return res.status(401).json({ message: 'Invalid admin credentials' });
        return res.json(buildRes(ADMIN));
    }

    if (isDBConnected()) {
        const User = require('../models/userModel');
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) return res.json(buildRes(user));
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // In-memory
    const user = store.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    return res.json(buildRes(user));
};

// ─── POST /api/users ────────────────────────────────────
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (email === ADMIN.email) return res.status(400).json({ message: 'This email is reserved.' });

    if (isDBConnected()) {
        const User = require('../models/userModel');
        if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
        const user = await User.create({ name, email, password });
        if (user) { store.users.push({ id: user._id, name, email }); return res.status(201).json(buildRes(user)); }
        return res.status(400).json({ message: 'Invalid user data' });
    }

    if (store.users.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = { id: `usr_${Date.now()}`, name, email, password: hashed, isAdmin: false };
    store.users.push(newUser);
    return res.status(201).json(buildRes(newUser));
};

module.exports = { authUser, registerUser };
