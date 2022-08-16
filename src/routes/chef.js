const express = require('express');

const router = express.Router();

const chefControllers = require('../controllers/chef');
const isAuthenticated = require('../middleware/isAuthenticated');

// IMPORTANT NOTE: The order of the routes matters as middleware functions are executed sequentially

// PUBLIC ROUTES
router.get('/', chefControllers.getAllChefs);
router.get('/nearby-chefs', chefControllers.getNearbyChefs);
router.get('/:username', chefControllers.getSpecificChef);

// PRIVATE ROUTES
router.get('/profile/:username', isAuthenticated, chefControllers.seeProfile);
router.put(
  '/profile/:username',
  isAuthenticated,
  chefControllers.updateProfile
);
router.post('/:username/profile', chefControllers.addLocation);
router.put('/:username/profile/:locationId', chefControllers.updateLocation);
router.delete('/:username/profile/:locationId', chefControllers.deleteLocation);

router.post('/dishes/:username', isAuthenticated, chefControllers.addDish);
router.put(
  '/dishes/:username/:dishId',
  isAuthenticated,
  chefControllers.updateDishInfos
);
router.delete(
  '/dishes/:username/:dishId',
  isAuthenticated,
  chefControllers.deleteDish
);

router.get('/orders/:username', isAuthenticated, chefControllers.getOrders);
router.put(
  '/orders/:username/:orderId',
  isAuthenticated,
  chefControllers.finishPreparation
);

module.exports = router;
