// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem'); // Clean path to the MenuItem model

// 1. POST Route to add a menu item (POST /api/v1/menu)
router.post('/', async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        if (mongoose.connection.readyState === 1) await newItem.save();
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// 2. GET Route to fetch the entire menu (GET /api/v1/menu)
router.get('/', async (req, res) => {
    try {
        let menu = [];
        if (mongoose.connection.readyState === 1) {
            menu = await MenuItem.find();
        } else {
            menu = [{ name: "Garlic Fries (Mock)", price: 5.99, category: "Appetizer" }];
        }
        res.status(200).json({ success: true, data: menu });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;