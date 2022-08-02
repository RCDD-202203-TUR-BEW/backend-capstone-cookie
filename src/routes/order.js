const express = require('express');

const router = express.Router();
const orderControllers = require('../controllers/order');

// GET CUSTOMER ORDER
router.get('/:customerid/order', orderControllers.getCustomerOrder);

// GET ALL PREVIOUS CUSTOMER ORDERS
router.get('/:customerid/orders', orderControllers.getAllPrevOrders);

module.exports = router;
