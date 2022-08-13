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
  '/:customerId/location',
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

router.delete('/:id', customerController.deleteAccount); // delete account
// router.get('/rate', customerController); // rated dishes
// router.get('/rate/:id', customerController); // rated a single dish

// router.put('/orders', customerController); // update orders

module.exports = router;
