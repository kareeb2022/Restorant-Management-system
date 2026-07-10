// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// 1. IMPORT THE SECURITY GUARD HERE
const { protect, authorize } = require('../middleware/authMiddleware');


// (POST /place can remain open so public customers can place orders!)
router.post('/', async (req, res) => {
    // ... layout remains exactly the same ...
});

// 2. PROTECT FETCHING ALL ORDERS (Add 'protect' right here)
router.get('/', protect,authorize('admin'), async (req, res) => {
    try {
        let orders = [];
        if (mongoose.connection.readyState === 1) {
            orders = await Order.find();
        } else {
            orders = [{ _id: "mock_id_1", items: [{ menuItem: "Garlic Fries", quantity: 2 }], totalPrice: 11.98, status: "Pending" }];
        }
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 3. PROTECT REVENUE DASHBOARD (Add 'protect' right here)
router.get('/revenue', protect, async (req, res) => {
    // ... layout remains exactly the same ...
});

module.exports = router;