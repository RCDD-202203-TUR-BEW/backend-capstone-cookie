const express = require('express');

const router = express.Router();

const chefControllers = require('../controllers/chef');
const isAuthenticated = require('../middleware/isAuthenticated');

// PUBLIC ROUTES
router.get('/', chefControllers.getAllChefs);
router.get('/:username', chefControllers.getSpecificChef);
// router.get("/nearby-chefs",chefControllers.getNearbyChefs)
router.get('/dishes', chefControllers.getAllDishes);
router.get('/dishes/:dishId', chefControllers.getSpecificDish);
router.get('/dishes/filter', chefControllers.filterDishes);
router.get('/:username/dishes', chefControllers.getChefDishes);

// PRIVATE ROUTES
router.get('/:username/profile', isAuthenticated, chefControllers.seeProfile);
router.put(
  '/:username/profile',
  isAuthenticated,
  chefControllers.updateProfile
);

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

// router.get('/order', chefControllers); // specific order

// router.put('/update-details', chefControllers); // oredr details

// router.delete('/delete-details', chefControllers); // delete address

module.exports = router;
