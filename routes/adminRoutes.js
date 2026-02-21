const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Public routes (no auth required)
router.post('/login', adminController.postLogin);

// Protected routes (require admin authentication)
router.get('/dashboard', adminAuth, adminController.getDashboard);
router.post('/add-dish', adminAuth, upload.single('image'), adminController.addDish);
router.get('/orders', adminAuth, adminController.getOrders);
router.post('/orders/:id/status', adminAuth, adminController.updateOrderStatus);
router.post('/logout', adminAuth, adminController.logout);

module.exports = router;
