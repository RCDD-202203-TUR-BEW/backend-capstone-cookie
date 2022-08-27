const express = require('express');

const router = express.Router();

const chefControllers = require('../controllers/chef');
const isAuthenticated = require('../middleware/isAuthenticated');
const permit = require('../middleware/authorization');

// IMPORTANT NOTE: The order of the routes matters as middleware functions are executed sequentially

// PUBLIC ROUTES
router.get('/', chefControllers.getAllChefs);
router.get('/nearby-chefs', chefControllers.getNearbyChefs);
router.get('/:username', chefControllers.getSpecificChef);

// PRIVATE ROUTES
router.get(
  '/profile/:username',
  isAuthenticated,
  permit('chef'),
  chefControllers.seeProfile
);
router.put(
  '/profile/:username',
  permit('chef'),
  isAuthenticated,
  chefControllers.updateProfile
);

router.post(
  '/dishes/:username',
  isAuthenticated,
  permit('chef'),
  chefControllers.addDish
);
router.put(
  '/dishes/:username/:dishId',
  isAuthenticated,
  permit('chef'),
  chefControllers.updateDishInfos
);
router.delete(
  '/dishes/:username/:dishId',
  isAuthenticated,
  permit('chef'),
  chefControllers.deleteDish
);

router.get(
  '/orders/:username',
  isAuthenticated,
  permit('chef'),
  chefControllers.getOrders
);
router.put(
  '/orders/:username/:orderId',
  isAuthenticated,
  permit('chef'),
  chefControllers.finishPreparation
);

module.exports = router;
