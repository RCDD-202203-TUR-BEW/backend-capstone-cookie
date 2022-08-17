const _ = require('lodash');
const Users = require('../models/user').User;
const Chefs = require('../models/user').Chef;
const Dishes = require('../models/dish');

const dishControllers = {};

dishControllers.getAllDishes = async (req, res) => {
  const dishes = await Dishes.find({});
  if (!dishes)
    return res.status(404).json({ message: 'No dishes to show at this time' });
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
    return res.status(404).json({
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

module.exports = dishControllers;
