const express = require('express');

const router = express.Router();

const chefControllers = require('../controllers/chef');
const isAuthenticated = require('../middleware/isAuthenticated');

// PUBLIC ROUTES
router.get('/', chefControllers.getAllChefs);
router.get('/:username', chefControllers.getSpecificChef);
// router.get("/nearby-chefs",chefControllers.getNearbyChefs)
// router.get('/:username/dishes', chefControllers.getDishes);
// router.get('/dishes/:dishId', chefControllers); // dish by id
// router.get('/dishes/filter', chefControllers); // filter dishes

// PRIVATE ROUTES

router.get('/profile/:username', isAuthenticated, chefControllers.seeProfile);
router.put(
  '/profile/:username',
  isAuthenticated,
  chefControllers.updateProfile
);

// router.post('/dishes', chefControllers); // add dish
// router.put('/dishes/:dishId', chefControllers); // update dish
// router.delete('/dishes/:dishId', chefControllers); // delete dish
// router.get('/order', chefControllers); // specific order

// router.get('/rate', chefControllers); // rated dishes

// router.put('/update-details', chefControllers); // oredr details

// router.delete('/delete-details', chefControllers); // delete address

module.exports = router;
