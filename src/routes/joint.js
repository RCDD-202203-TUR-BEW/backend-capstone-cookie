const express = require('express');

const router = express.Router();
const chefController = require('../controllers/chef');
const customerController = require('../controllers/customer');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/orders', isAuthenticated, customerController); // all orders for customers
router.get('/orders', isAuthenticated, chefController); // all orders for chefs

module.exports = router;
