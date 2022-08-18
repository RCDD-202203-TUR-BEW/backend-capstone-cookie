const _ = require('lodash');
const Users = require('../models/user').User;
const Chefs = require('../models/user').Chef;
const Dishes = require('../models/dish');

const dishControllers = {};

const storage = require('../db/storage');
const { getFileExtension } = require('../utils/utils');

const DISH_IMAGE_DIR = 'dishes';

dishControllers.getAllDishes = async (req, res) => {
  const dishes = await Dishes.find({});
  if (!dishes) return res.json({ message: 'No dishes to show at this time' });
  return res.json(dishes);
};

dishControllers.getNearbyDishes = async (req, res) => {
  const { _id } = req.user;
  const user = await Users.findOne({ _id });
  const userLocation = user.locations[0]?.city;
  const chefs = await Chefs.find({});
  if (!chefs) return res.json({ message: 'No chefs to show at this time' });
  let dishesIds = [];
  chefs.forEach((chef) => {
    chef.locations.forEach((location) => {
      if (location.city === userLocation) dishesIds.push(chef.dishes);
    });
  });

  if (dishesIds.length === 0)
    return res.json({
      message: `No available dishes in ${userLocation} province at this time`,
    });

  // because each chef has an array of dishes that's why we're flatenning them here
  dishesIds = dishesIds.flat();

  const dishes = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const dishId of dishesIds) {
    // eslint-disable-next-line no-await-in-loop
    const dish = await Dishes.findOne({ _id: dishId.toString() });
    if (dish !== null) dishes.push(dish);
  }

  return res.json(dishes);
};

dishControllers.getSpecificDish = async (req, res) => {
  const { dishId } = req.params;
  const dish = await Dishes.findOne({ _id: dishId });
  if (!dish) return res.status(400).json({ message: "Dish isn't available" });
  return res.json(dish);
};

dishControllers.filterDishes = async (req, res) => {
  const queries = {};
  const filteringProperties = [
    'title',
    'cuisine',
    'dish_type',
    'price',
    'ingredients',
  ];

  // to avoid wrong or empty queries
  const properties = Object.keys(req.query);
  properties.forEach((prop) => {
    if (filteringProperties.includes(prop) && req.query[prop]) {
      if (prop === 'price') {
        // query example: price=44-77
        const [min, max] = req.query[prop].split('-');
        queries[prop] = { $gte: +min, $lte: +max };
      } else if (prop === 'cuisine' || prop === 'dish_type') {
        // Start case (First letter of each word capitalized) to match enums in the schema
        queries[prop] = _.startCase(_.toLower(req.query[prop]));
      } else queries[prop] = req.query[prop];
    }
  });

  const results = await Dishes.find(queries);

  if (_.isEmpty(queries)) res.status(400).json({ message: 'Invalid query!' });
  else if (results.length === 0)
    res.status(400).json({ message: 'Results not found' });
  else {
    res.json(results);
  }
};

dishControllers.getChefDishes = async (req, res) => {
  try {
    const { username } = req.params;
    const chef = await Chefs.findOne({ username }).populate('dishes');
    if (chef) {
      const chefDishes = chef.dishes;
      if (chefDishes.length !== 0) {
        res.json(chefDishes);
      } else
        res.json({
          message: `No available dishes for chef: ${username} for now`,
        });
    } else res.json({ message: `No chef with username: ${username}` });
  } catch (err) {
    res.json({ error: err.message });
  }
};

//

dishControllers.uploadDishImage = async (req, res) => {
  console.log('-------- uploadDishImage');
  try {
    if (req.file) {
      // get dish id from params
      const { dishId } = req.params;

      // get dish from db
      const dish = await Dishes.findById(dishId);

      const nextImageIndex = dish.images.length;
      console.log(nextImageIndex);
      const fileName = `${DISH_IMAGE_DIR}/${dishId}_${nextImageIndex}.${getFileExtension(
        req.file.originalname
      )}`;
      // upload image to firebase storage
      const imageURL = await storage.uploadImage(req.file, fileName);
      // assign image url to dish images array
      dish.images.push(imageURL);
      dish.save();
      res.status(200).json({ message: 'dish image uploaded successfully' });
    } else {
      res.status(200).json({ message: 'no image to upload' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

dishControllers.fetchDishImage = async (req, res) => {
  try {
    const { dishId, index } = req.params;
    const dish = await Dishes.findById(dishId);
    const imageURL = dish.images[index];
    res.status(200).json(imageURL);
  } catch (error) {
    res.status(500).json({ error });
  }
};

dishControllers.fetchAllDishImages = async (req, res) => {
  try {
    const { dishId } = req.params;
    const dish = await Dishes.findById(dishId);
    const imageURLs = dish.images;
    res.status(200).json(imageURLs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

dishControllers.updateDishImage = async (req, res) => {
  console.log('-------- updateDishImage');
  try {
    const { dishId, index } = req.params;
    const dish = await Dishes.findById(dishId);
    if (req.file) {
      const newFileName = `${DISH_IMAGE_DIR}/${dishId}_${index}.${getFileExtension(
        req.file.originalname
      )}`;

      const file = dish.images[index].split('%2F')[1];
      const oldFileName = `${DISH_IMAGE_DIR}/${file}`;
      console.log(oldFileName);
      console.log(newFileName);
      const imageURL = await storage.updateImage(
        req.file,
        oldFileName,
        newFileName
      );
      //   no need to update the image url in the images array, not changing the image url at this index
      res.status(200).json({ message: 'dish image updated successfully' });
    } else {
      res.status(200).json({ message: 'no image to update' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

dishControllers.deleteDishImage = async (req, res) => {
  console.log('-------- deleteDishImage');
  try {
    const { dishId, index } = req.params;
    const dish = await Dishes.findById(dishId);
    const imageURL = dish.images[index];

    // get the file name from the image url
    const file = imageURL.split('%2F')[1];
    const fileName = `${DISH_IMAGE_DIR}/${file}`;
    console.log(fileName);
    await storage.deleteImage(fileName);
    dish.images.splice(index, 1);
    dish.save();
    res.status(200).json({ message: 'dish image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = dishControllers;
