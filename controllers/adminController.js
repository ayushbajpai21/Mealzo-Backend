const Dish = require('../models/Dish');
const Order = require('../models/Order');
const cloudinary = require('../config/cloudinary');

// Admin Login
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check credentials against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            req.session.adminLoggedIn = true;
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
};

// Get Dashboard Data
exports.getDashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const completedOrders = await Order.countDocuments({ status: 'Completed' });
        const totalDishes = await Dish.countDocuments();

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'displayName email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get order data for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const ordersByDay = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                    totalDishes
                },
                recentOrders,
                ordersByDay
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add Dish
exports.addDish = async (req, res) => {
    try {
        const { name, type, category, price, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'cloud-kitchen' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Create dish
        const dish = new Dish({
            name,
            type,
            category,
            price,
            description,
            image: result.secure_url
        });

        await dish.save();

        res.json({
            success: true,
            message: 'Dish added successfully',
            data: dish
        });
    } catch (error) {
        console.error('Add dish error:', error);
        // Provide more specific error message if it's Cloudinary related
        const message = error.message || 'Failed to add dish';
        res.status(500).json({
            success: false,
            message: message.includes('Cloudinary') ? 'Cloudinary Error: Check your credentials in .env' : 'Failed to add dish',
            error: error.message
        });
    }
};

// Get Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'displayName email phoneNumber')
            .populate('items.dish', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
