const express = require('express');
const mongoose = require('mongoose');

// Force Node to look up IPv4 addresses first (keeps things smooth on Windows)
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

// --- 1. IMPORT ROUTES (Cleaned & Pointing to /routes folder) ---
const authRoutes = require('./Route/authRoutes');   // Handles Register & Login
const menuRoutes = require('./Route/menuRoutes');   // Handles Menu POST & GET
const orderRoutes = require('./models/order'); // Handles Orders & Analytics

const app = express();

// Middleware to parse incoming JSON from Postman
app.use(express.json());

// --- 2. BASE ROUTES ---

app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Restaurant API!" });
});

// --- 3. MOUNT SEPARATED ROUTES ---
app.use('/api/v1/auth', authRoutes);        // Mounts registration and login
app.use('/api/v1/menu', menuRoutes);        // Mounts menu endpoints
app.use('/api/v1/orders', orderRoutes);      // Mounts order endpoints
app.use('/api/v1/analytics', orderRoutes);   // Mounts revenue analytics

// --- 4. DATABASE CONNECTION ---

const MONGO_URI = "mongodb://kareeb_2026:kareebaws@cluster0-shard-00-00.nvbjbnn.mongodb.net:27017,cluster0-shard-00-01.nvbjbnn.mongodb.net:27017,cluster0-shard-00-02.nvbjbnn.mongodb.net:27017/restaurant?ssl=true&replicaSet=atlas-nvbjbnn-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB!"))
    .catch((err) => console.error("Database connection error (Running in safe sandbox mode):", err.message));

// --- 5. SERVER START ---

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT}`);
});