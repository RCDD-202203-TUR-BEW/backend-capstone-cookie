const express = require('express');

const routes = express.Router();
const orderControllers = require('../controllers/order');

// GET CUSTOMER ORDER
routes.get('/:customerid/order', orderControllers.getCustomerOrder);

// GET ALL PREVIOUS CUSTOMER ORDERS
routes.get('/:customerid/orders', orderControllers.getAllPrevOrders);

module.exports = routes;
