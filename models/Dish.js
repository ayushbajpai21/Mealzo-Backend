const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);
