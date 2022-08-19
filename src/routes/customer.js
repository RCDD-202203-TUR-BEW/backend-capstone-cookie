/* eslint-disable prettier/prettier */

const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customer');

// Public Routes
router.get('/:username', customerController.getProfile); // returns customer object

// Private Routes : need isAuthenticated middleware
router.put('/profile/:id', customerController.updateProfile); // update operation will done on profile information page

router.post('/:customerId/location', customerController.createLocation); // create and add location to customer

router.get(
  '/:customerId/locations',
  customerController.getAllLcationsByCustomerId
); // get all locations of customer by id
router.get(
  '/:customerId/location/:locationId',
  customerController.getLocationById
); // get location object with an id of that customerId/:customerId

router.put(
  '/:customerId/location/:locationId',
  customerController.updateLocationById
); // update location object with an id of that customerId/:customerId

router.delete(
  '/:customerId/location/:locationId',
  customerController.deleteLocationById
); // delete address object with an id of that customerId/:customerId

router.delete('/:id', customerController.deleteAccount); // delete account                          // customer can delete his account?

// const chefController = require('../controllers/chef');

// router.get('/rate', customerController); // rated dishes
// router.get('/rate/:id', customerController); // rated a single dish

// router.put('/orders', customerController); // update orders

// router.delete('/deleteAccount', customerController); // delete account
// router.get('/chefs', chefController); // all chefs"
// router.get('/chefs/:username', chefController); // all chefs"
// router.get('/dishes/dishId', chefController); // dish by id
// router.get('/dishes/filter', chefController); // filter dishes

module.exports = router;
