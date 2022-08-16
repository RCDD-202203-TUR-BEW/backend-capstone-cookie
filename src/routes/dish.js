const express = require('express');

const router = express.Router();

const dishControllers = require('../controllers/dish');
const isAuthenticated = require('../middleware/isAuthenticated');

// IMPORTANT NOTE: The order of the routes matters as middleware functions are executed sequentially

// PRIVATE ROUTES
router.get('/nearby-dishes', isAuthenticated, dishControllers.getNearbyDishes);

// PUBLIC ROUTES
router.get('/', dishControllers.getAllDishes);
router.get('/filter', dishControllers.filterDishes);
router.get('/:dishId', dishControllers.getSpecificDish);
router.get('/chef/:username', dishControllers.getChefDishes);

module.exports = router;
