const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// 1. ADD NEW FOOD ITEM (POST /api/v1/food/add)
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Simple validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const newFood = new Food({ name, description, price, category });
        await newFood.save();

        res.status(201).json({ message: "Food item added successfully!", food: newFood });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

const orderSchema = new mongoose.Schema({
    items: [{
        menuItem: { type: String, required: true }, // The name or ID of the dish
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Preparing, Completed
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 2. GET ALL FOOD ITEMS (GET /api/v1/food/all)
router.get('/all', async (req, res) => {
    try {
        const menu = await Food.find();
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;