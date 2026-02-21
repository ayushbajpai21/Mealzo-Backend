const Order = require('../models/Order');
const Dish = require('../models/Dish');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (requires Firebase auth)
const createOrder = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        // Calculate total amount and validate items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const dish = await Dish.findById(item.dishId);

            if (!dish) {
                return res.status(404).json({
                    success: false,
                    message: `Dish not found: ${item.dishId}`
                });
            }

            if (!dish.available) {
                return res.status(400).json({
                    success: false,
                    message: `Dish not available: ${dish.name}`
                });
            }

            const itemTotal = dish.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                dish: dish._id,
                quantity: item.quantity,
                price: dish.price
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === 'Online' ? 'Pending' : 'Pending'
        });

        // Populate order details
        await order.populate('items.dish', 'name image');

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private (requires Firebase auth)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.dish', 'name image')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (requires Firebase auth)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.dish', 'name image price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
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
    createOrder,
    getMyOrders,
    getOrderById
};
