const express = require('express');

const routes = express.Router();
const orderControllers = require('../controllers/order');

/**
 * @swagger
 * /:customerid/order:
 *  get:
 *    description: this endpoint should return the last order
 *    responses:
 *      '200':
 *        description: successful response
 */

// GET CUSTOMER ORDER
routes.get('/:customerid/order', orderControllers.getCustomerOrder);

/**
 * @swagger
 * /:customerid/orders:
 *  get:
 *    description: this endpoint should return all the order that the customer made
 *    responses:
 *      '200':
 *        description: successful response
 */

// GET ALL PREVIOUS CUSTOMER ORDERS
routes.get('/:customerid/orders', orderControllers.getAllPrevOrders);

/**
 * @swagger
 * /:customerid/order:
 *  post:
 *    description: this endpoint should create new order for the user or add new dish to the order
 *    responses:
 *      '200':
 *        description: successful response
 */

// CREATE NEW ORDER
routes.post('/:customerid/order', orderControllers.addNewOrder);

/**
 * @swagger
 * /:customerid/order:
 *  put:
 *    description: this endpoint should update the order information like quantity
 *    responses:
 *      '200':
 *        description: successful response
 */

// UPDATE ORDER
routes.put('/:customerid/order', orderControllers.updateOrder);

/**
 * @swagger
 * /:customerid/orders:
 *  delete:
 *    description: this endpoint should delete the order in your basket
 *    responses:
 *      '200':
 *        description: successful response
 */

// DELETE ORDER
routes.delete('/:customerid', orderControllers.deleteOrder);

module.exports = routes;
