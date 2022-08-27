const express = require('express');
const permit = require('../middleware/authorization');

const routes = express.Router();
const orderControllers = require('../controllers/order');

// GET CUSTOMER ORDER
routes.get(
  '/:customerid/order',
  permit('customer'),
  orderControllers.getCustomerOrder
);

// GET ALL PREVIOUS CUSTOMER ORDERS
routes.get(
  '/:customerid/orders',
  permit('customer'),
  orderControllers.getAllPrevOrders
);

// CREATE NEW ORDER
routes.post('/:customerid/order', orderControllers.addNewOrder);

// UPDATE ORDER
routes.put(
  '/:customerid/order',
  permit('customer'),
  orderControllers.updateOrder
);

// DELETE ORDER
routes.delete(
  '/:customerid/order',
  permit('customer'),
  orderControllers.deleteOrder
);

// DELETE DISH
routes.delete(
  '/:customerid/:dishid',
  permit('customer'),
  orderControllers.deleteDish
);

module.exports = routes;
