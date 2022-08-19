const express = require('express');
const permit = require('../middleware/authorization');

const router = express.Router();

const customerController = require('../controllers/customer');

// Public Routes
router.get('/:username', permit('customer'), customerController.getProfile); // returns customer object

// Private Routes : need isAuthenticated middleware
router.put(
  '/profile/:id',
  permit('customer'),
  customerController.updateProfile
); // update operation will done on profile information page

// ADDED PERMISSIONS FOR BOTH CUSTOMERS AND CHEFS HERE UNTIL WE MOVE LOCATION CONTROLLERS TO A SEPARATE FILE AND GENERALIZE THEM.

router.post(
  '/:customerId/location',
  permit('customer', 'chef'),
  customerController.createLocation
); // create and add location to customer

router.get(
  '/:customerId/location',
  permit('customer', 'chef'),
  customerController.getAllLcationsByCustomerId
); // get all locations of customer by id
router.get(
  '/:customerId/location/:locationId',
  permit('customer', 'chef'),
  customerController.getLocationById
); // get location object with an id of that customerId/:customerId

router.put(
  '/:customerId/location/:locationId',
  permit('customer', 'chef'),
  customerController.updateLocationById
); // update location object with an id of that customerId/:customerId

router.delete(
  '/:customerId/location/:locationId',
  permit('customer', 'chef'),
  customerController.deleteLocationById
); // delete address object with an id of that customerId/:customerId

router.delete('/:id', permit('customer'), customerController.deleteAccount); // delete account

// router.get('/rate', customerController); // rated dishes
// router.get('/rate/:id', customerController); // rated a single dish

module.exports = router;
