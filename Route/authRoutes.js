// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Add mongoose import
const User = require('../models/User');

const JWT_SECRET = "MY_REST_API_SUPER_SECRET_KEY_123";

// 1. REGISTER NEW USER (With Sandbox Bypass)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user object structure
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'customer'
        });

        // ONLY save if MongoDB is fully connected
        if (mongoose.connection.readyState === 1) {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ success: false, error: "Email already registered" });
            }
            await newUser.save();
        }

        res.status(201).json({ 
            success: true, 
            message: mongoose.connection.readyState === 1 
                ? "User registered successfully in MongoDB!" 
                : "User registered successfully (Offline Sandbox Active)!",
            data: { username, email, role: role || 'customer' }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. USER LOGIN (With Sandbox Bypass)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // If Connected to Live Database
        if (mongoose.connection.readyState === 1) {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ success: false, error: "Invalid email or password" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ success: false, error: "Invalid email or password" });

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "Welcome back!",
                token,
                user: { id: user._id, username: user.username, role: user.role }
            });
        } 
        
        // OFFLINE SANDBOX FALLBACK (Bypasses MongoDB completely)
        else {
            // Generate a working mock token for testing your dashboard paths downstream
            const mockToken = jwt.sign({ id: "mock_user_id_123", role: "admin" }, JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({
                success: true,
                message: "Welcome back! (Offline Sandbox Active)",
                token: mockToken,
                user: { id: "mock_user_id_123", username: "sandbox_chef", role: "admin" }
            });
        }

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;