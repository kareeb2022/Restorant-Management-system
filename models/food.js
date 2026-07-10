const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true, // e.g., 'Appetizer', 'Main Course', 'Dessert', 'Drinks'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const mongoose = require('mongoose');


module.exports = mongoose.model('Food', FoodSchema);