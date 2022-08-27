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

router.delete('/:id', permit('customer'), customerController.deleteAccount); // delete account

// router.get('/rate', customerController); // rated dishes
// router.get('/rate/:id', customerController); // rated a single dish

module.exports = router;
