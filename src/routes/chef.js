const express = require('express');

const router = express.Router();

const chefControllers = require('../controllers/chef');
const isAuthenticated = require('../middleware/isAuthenticated');

// IMPORTANT NOTE: The order of the routes matters as middleware functions are executed sequentially

// PUBLIC ROUTES
router.get('/', chefControllers.getAllChefs);
router.get('/nearby-chefs', chefControllers.getNearbyChefs);
router.get('/dishes', chefControllers.getAllDishes);
router.get('/dishes/filter', chefControllers.filterDishes);
router.get('/dishes/:dishId', chefControllers.getSpecificDish);
router.get('/:username/dishes', chefControllers.getChefDishes);
router.get('/:username', chefControllers.getSpecificChef);

// PRIVATE ROUTES
router.get('/:username/profile', isAuthenticated, chefControllers.seeProfile);
router.put(
  '/:username/profile',
  isAuthenticated,
  chefControllers.updateProfile
);
router.post('/:customerId/profile', chefControllers.addLocation);
router.put('/:username/profile/:locationId', chefControllers.updateLocation);
router.delete('/:username/profile/:locationId', chefControllers.deleteLocation);

router.post('/:username/dishes', isAuthenticated, chefControllers.addDish);
router.put(
  '/:username/dishes/:dishId',
  isAuthenticated,
  chefControllers.updateDishInfos
);
router.delete(
  '/:username/dishes/:dishId',
  isAuthenticated,
  chefControllers.deleteDish
);

router.get('/:username/orders', isAuthenticated, chefControllers.getOrders);
router.put(
  '/:username/orders/:orderId',
  isAuthenticated,
  chefControllers.finishPreparation
);

module.exports = router;
