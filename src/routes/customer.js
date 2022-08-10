/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customer');

// Public Routes
// router.get('/',                   customerController.getProfile           );   // what is purpose of this route?
router.get('/:username', customerController.getProfile); // returns customer object        // why we need profile in here

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

router.delete('/:id', customerController.deleteAccount); // delete account                          // customer can delete his account?

module.exports = router;
