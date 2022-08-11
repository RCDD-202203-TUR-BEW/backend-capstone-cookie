const express = require('express');

const routes = express.Router();
const orderControllers = require('../controllers/order');

// GET CUSTOMER ORDER
routes.get('/:customerid/order', orderControllers.getCustomerOrder);

// GET ALL PREVIOUS CUSTOMER ORDERS
routes.get('/:customerid/orders', orderControllers.getAllPrevOrders);

// CREATE NEW ORDER
routes.post('/:customerid/order', orderControllers.addNewOrder);

// UPDATE ORDER
routes.put('/:customerid/order', orderControllers.updateOrder);

// DELETE ORDER
routes.delete('/:customerid/order', orderControllers.deleteOrder);

module.exports = routes;
