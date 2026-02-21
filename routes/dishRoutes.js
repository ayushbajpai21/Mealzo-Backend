const express = require('express');
const router = express.Router();
const { getAllDishes, getDishById } = require('../controllers/dishController');

// Public routes
router.get('/', getAllDishes);
router.get('/:id', getDishById);

module.exports = router;
