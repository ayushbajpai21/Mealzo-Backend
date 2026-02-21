const Dish = require('../models/Dish');

// @desc    Get all dishes
// @route   GET /api/dishes
// @access  Public
const getAllDishes = async (req, res) => {
    try {
        const { type, category } = req.query;

        let filter = { available: true };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        const dishes = await Dish.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: dishes.length,
            data: dishes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single dish
// @route   GET /api/dishes/:id
// @access  Public
const getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: 'Dish not found'
            });
        }

        res.json({
            success: true,
            data: dish
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = {
    getAllDishes,
    getDishById
};
