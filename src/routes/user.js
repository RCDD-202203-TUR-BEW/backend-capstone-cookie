const express = require('express');

const router = express.Router();
const Multer = require('multer');
const permit = require('../middleware/authorization');
const userController = require('../controllers/user');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // no larger than 10mb, you can change as needed.
  },
});

// User endpoints
// getAvatar , deleteAvatar
router.get(
  '/getAvatar/:userId',
  permit('customer', 'chef'),
  userController.fetchUserAvatar
);

router.delete(
  '/deleteAvatar/:userId',
  permit('customer', 'chef'),
  userController.deleteUserAvatar
);

router.put(
  '/uploadAvatar/:userId',
  multer.single('avatar'),
  permit('customer', 'chef'),
  userController.uploadUserAvatar
);

// Location related routes for both customers and chefs
router.post(
  '/:userId/locations',
  permit('customer', 'chef'),
  userController.createLocation
); // create and add location to customer

router.get(
  '/:userId/locations',
  permit('customer', 'chef'),
  userController.getAllLocations
); // get all locations of customer by id
router.get(
  '/:userId/location/:locationId',
  permit('customer', 'chef'),
  userController.getSpecificLocation
); // get location object with an id of that userId/:userId

router.put(
  '/:userId/location/:locationId',
  permit('customer', 'chef'),
  userController.updateLocation
); // update location object with an id of that userId/:userId

router.delete(
  '/:userId/location/:locationId',
  permit('customer', 'chef'),
  userController.deleteLocation
); // delete address object with an id of that userId/:userId

module.exports = router;
