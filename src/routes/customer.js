/* eslint-disable prettier/prettier */

const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customer');

/**
 * @swagger
 * /api/customer/:customer:
 *  get:
 *    description: this endpoint should return a user by his username
 *    responses:
 *      '200':
 *        description: successful response
 */

// Public Routes
router.get('/:username', customerController.getProfile); // returns customer object

/**
 * @swagger
 * /api/customer/profile/:id:
 *  put:
 *    description: this endpoint should update the profile details depending on his id
 *    responses:
 *      '200':
 *        description: successful response
 */
// Private Routes : need isAuthenticated middleware
router.put('/profile/:id', customerController.updateProfile); // update operation will done on profile information page

/**
 * @swagger
 * /api/customer/:customerId/location:
 *  post:
 *    description: this endpoint should create or push new location to the user
 *    responses:
 *      '200':
 *        description: successful response
 */
router.post('/:customerId/location', customerController.createLocation); // create and add location to customer

/**
 * @swagger
 * /api/customer/:customerId/location:
 *  get:
 *    description: this endpoint should return all location that the user have
 *    responses:
 *      '200':
 *        description: successful response
 */
router.get(
  '/:customerId/location',
  customerController.getAllLcationsByCustomerId
); // get all locations of customer by id

/**
 * @swagger
 * /api/customer/:customerId/location/:locationId:
 *  get:
 *    description: this endpoint should return location by using user id and user location id
 *    responses:
 *      '200':
 *        description: successful response
 */
router.get(
  '/:customerId/location/:locationId',
  customerController.getLocationById
); // get location object with an id of that customerId/:customerId

/**
 * @swagger
 * /api/customer/:customerId/location/:locationId:
 *  put:
 *    description: this endpoint should update the location using user id and user location id
 *    responses:
 *      '200':
 *        description: successful response
 */
router.put(
  '/:customerId/location/:locationId',
  customerController.updateLocationById
); // update location object with an id of that customerId/:customerId

/**
 * @swagger
 * /api/customer/:customerId/location/:locationId:
 *  delete:
 *    description: this endpoint should delete the address of the user using the location id
 *    responses:
 *      '200':
 *        description: successful response
 */
router.delete(
  '/:customerId/location/:locationId',
  customerController.deleteLocationById
); // delete address object with an id of that customerId/:customerId

/**
 * @swagger
 * /api/customer/:id:
 *  delete:
 *    description: this endpoint should delete the user account
 *    responses:
 *      '200':
 *        description: successful response
 */
router.delete('/:id', customerController.deleteAccount); // delete account                          // customer can delete his account?

const chefController = require('../controllers/chef');

router.get('/rate', customerController); // rated dishes
router.get('/rate/:id', customerController); // rated a single dish

router.put('/orders', customerController); // update orders

router.delete('/deleteAccount', customerController); // delete account
router.get('/chefs', chefController); // all chefs"
router.get('/chefs/:username', chefController); // all chefs"
router.get('/dishes/dishId', chefController); // dish by id
router.get('/dishes/filter', chefController); // filter dishes

module.exports = router;
