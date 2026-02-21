const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createOrder, getMyOrders, getOrderById } = require('../controllers/orderController');

// Protected routes (require JWT authentication)
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

module.exports = router;
