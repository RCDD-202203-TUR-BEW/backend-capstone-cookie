const _ = require('lodash');
const Chefs = require('../models/user').Chef;
const Dishes = require('../models/dish');
const Orders = require('../models/order');
const {
  createLocation,
  updateLocationById,
  deleteLocationById,
} = require('./customer');
const provincesOfTurkey = require('../helpers/provincesOfTurkey');

const chefControllers = {};

chefControllers.getAllChefs = async (req, res) => {
  const chefs = await Chefs.find({});
  if (!chefs)
    return res.status(404).json({ message: 'No chefs to show at this time' });
  return res.json(chefs);
};

chefControllers.getNearbyChefs = async (req, res) => {
  let { city } = req.query;
  city = _.capitalize(city);
  if (!provincesOfTurkey.includes(city))
    return res.status(400).json({ message: 'Wrong city name' });
  const chefs = await Chefs.find({});
  if (!chefs)
    return res.status(404).json({ message: 'No chefs to show at this time' });
  const nearbyChefs = [];
  chefs.forEach((chef) => {
    chef.locations.forEach((location) => {
      if (location.city === city) nearbyChefs.push(chef);
    });
  });

  if (nearbyChefs.length === 0)
    return res
      .status(400)
      .json({ message: `No chefs in ${city} province at this time` });

  return res.json(nearbyChefs);
};

chefControllers.getSpecificChef = async (req, res) => {
  const { username } = req.params;
  const chef = await Chefs.findOne({ username }).populate('dishes');
  if (!chef)
    return res
      .status(400)
      .json({ message: `No chef with username: ${username}` });
  return res.json(chef);
};

chefControllers.seeProfile = async (req, res) => {
  const { username } = req.params;
  const { _id } = req.user;
  const chef = await Chefs.findOne({ _id, username }).populate('dishes');
  if (!chef)
    return res
      .status(401)
      .send("You don't have authorization to view this page");
  return res.json(chef);
};

chefControllers.updateProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { _id } = req.user;
    const chef = await Chefs.findOne({ _id, username });
    if (!chef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const dataToBeUpdated = {};

      // to avoid updating with empty values
      const properties = Object.keys(req.body);
      properties.forEach((prop) => {
        if (req.body[prop]) dataToBeUpdated[prop] = req.body[prop];
      });

      const updatedChef = await Chefs.findByIdAndUpdate(_id, dataToBeUpdated, {
        new: true,
      }).populate('dishes');
      res.json(updatedChef);
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

chefControllers.addDish = async (req, res) => {
  try {
    const { username } = req.params;
    const { _id } = req.user;
    const relatedChef = await Chefs.findOne({ _id, username });
    if (!relatedChef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const { _id: chefId } = relatedChef;
      const { title, ingredients, description, images, price } = req.body;
      let { cuisine, dishType } = req.body;
      cuisine = _.capitalize(cuisine);
      dishType = _.startCase(_.toLower(dishType));

      const newDish = await Dishes.create({
        chef_id: chefId,
        title,
        ingredients,
        description,
        cuisine,
        dish_type: dishType,
        images,
        price,
      });

      relatedChef.dishes.push(newDish);
      await relatedChef.save();

      res.json(newDish);
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

chefControllers.updateDishInfos = async (req, res) => {
  try {
    const { username, dishId } = req.params;
    const { _id } = req.user;
    const relatedChef = await Chefs.findOne({ _id, username });
    if (!relatedChef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const isDishForRelatedChef = await Dishes.findOne({
        _id: dishId,
        chef_id: _id,
      });
      if (isDishForRelatedChef) {
        const dataToBeUpdated = {};
        const properties = Object.keys(req.body);
        properties.forEach((prop) => {
          if (req.body[prop]) {
            if (prop === 'dishType') dataToBeUpdated.dish_type = req.body[prop];
            else dataToBeUpdated[prop] = req.body[prop];
          }
        });
        const updatedDish = await Dishes.findByIdAndUpdate(
          dishId,
          dataToBeUpdated,
          {
            new: true,
          }
        );
        updatedDish.edited_at = Date.now();
        res.json(updatedDish);
      } else
        res.status(401).send("You don't have authorization to view this page");
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

chefControllers.deleteDish = async (req, res) => {
  try {
    const { username, dishId } = req.params;
    const { _id } = req.user;
    const relatedChef = await Chefs.findOne({ _id, username });
    if (!relatedChef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const isDishForRelatedChef = await Dishes.findOne({
        _id: dishId,
        chef_id: _id,
      });
      if (isDishForRelatedChef) {
        await Dishes.findByIdAndDelete(dishId);
        res.json('Dish has been deleted successfully');
      } else
        res.status(401).send("You don't have authorization to view this page");
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Note: the following order controllers aren't tested on postman since order functionality isn't working properly yet.

chefControllers.getOrders = async (req, res) => {
  try {
    const { username } = req.params;
    const { _id } = req.user;
    const relatedChef = await Chefs.findOne({ _id, username });
    if (!relatedChef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const orders = await Orders.find({
        dishes: { $elemMatch: { 'dish.chef_id': _id } },
      });
      if (orders.length === 0) res.json({ message: 'No orders for now' });
      else res.json(orders);
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

chefControllers.finishPreparation = async (req, res) => {
  try {
    const { username, orderId } = req.params;
    const { _id } = req.user;
    const relatedChef = await Chefs.findOne({ _id, username });
    if (!relatedChef)
      res.status(401).send("You don't have authorization to view this page");
    else {
      const order = await Orders.findOne({ _id: orderId });
      if (!order)
        res.status(400).json({ message: 'wrong query for the order' });
      else {
        order.status = 'completed';
        await order.save();
        res.json(order);
      }
    }
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = chefControllers;
