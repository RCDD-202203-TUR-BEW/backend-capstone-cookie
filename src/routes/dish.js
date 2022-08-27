const express = require('express');

const router = express.Router();

const Multer = require('multer');
const dishControllers = require('../controllers/dish');
const isAuthenticated = require('../middleware/isAuthenticated');
const permit = require('../middleware/authorization');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // no larger than 10mb, you can change as needed.
  },
});

// IMPORTANT NOTE: The order of the routes matters as middleware functions are executed sequentially

// PRIVATE ROUTES
router.get(
  '/nearby-dishes',
  isAuthenticated,
  permit('customer', 'chef'),
  dishControllers.getNearbyDishes
);

// PUBLIC ROUTES
router.get('/', dishControllers.getAllDishes);
router.get('/filter', dishControllers.filterDishes);
router.get('/:dishId', dishControllers.getSpecificDish);
router.get('/chef/:username', dishControllers.getChefDishes);

router.get('/:dishId/fetchAllDishImages/', dishControllers.fetchAllDishImages);
router.get('/:dishId/fetchDishImage/:index', dishControllers.fetchDishImage);
router.post(
  '/:dishId/uploadDishImage',
  multer.single('dish'),
  // permit('chef'),
  dishControllers.uploadDishImage
);
router.put(
  '/:dishId/updateDishImage/:index',
  multer.single('dish'),
  // permit('chef'),
  dishControllers.updateDishImage
);
router.delete(
  '/:dishId/deleteDishImage/:index',
  //  permit('chef'),
  dishControllers.deleteDishImage
);

module.exports = router;
