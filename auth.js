const express = require('express');
const router = express.Router();
const User = require('../models/User');

// REGISTER ENDPOINT
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", user: { username, email } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Add this
const jwt = require('jsonwebtoken'); // Add this
const User = require('../models/User');

const JWT_SECRET = "YOUR_SUPER_SECRET_KEY_HERE"; // Keep this safe later!

// 1. UPDATED REGISTER ENDPOINT (With Password Hashing)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword // Save the hashed password
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Add this
const jwt = require('jsonwebtoken'); // Add this
const User = require('../models/User');

const JWT_SECRET = "YOUR_SUPER_SECRET_KEY_HERE"; // Keep this safe later!

// 1. UPDATED REGISTER ENDPOINT (With Password Hashing)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword // Save the hashed password
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 2. NEW LOGIN ENDPOINT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: { id: user._id, username: user.username, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
const express = require('express');
const router = express.Router();

// Example login route
router.post('/login', (req, res) => {
    res.send('Login route working');
});


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Add this
const jwt = require('jsonwebtoken'); // Add this
const User = require('../models/User');

const JWT_SECRET = "YOUR_SUPER_SECRET_KEY_HERE"; // Keep this safe later!

// 1. UPDATED REGISTER ENDPOINT (With Password Hashing)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword // Save the hashed password
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 2. NEW LOGIN ENDPOINT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate a JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: { id: user._id, username: user.username, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;