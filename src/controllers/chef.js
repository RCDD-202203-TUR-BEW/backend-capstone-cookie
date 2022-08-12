const Chefs = require('../models/user').Chef;
const Dishes = require('../models/dish');

const chefControllers = {};

chefControllers.getAllChefs = async (req, res) => {
  const chefs = await Chefs.find({});
  if (!chefs) return res.json({ message: 'No chefs to show at this time' });
  return res.json(chefs);
};

chefControllers.getSpecificChef = async (req, res) => {
  const { username } = req.params;
  const chef = await Chefs.findOne({ username });
  if (!chef) return res.json({ message: `No chef with username: ${username}` });
  return res.json(chef);
};

chefControllers.getAllDishes = async (req, res) => {
  const dishes = await Dishes.find({});
  if (!dishes) return res.json({ message: 'No dishes to show at this time' });
  return res.json(dishes);
};

chefControllers.getSpecificDish = async (req, res) => {
  const { dishId } = req.params;
  const dish = await Dishes.findOne({ _id: dishId });
  if (!dish) return res.status(400).json({ message: "Dish isn't available" });
  return res.json(dish);
};

chefControllers.getChefDishes = async (req, res) => {
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

chefControllers.seeProfile = async (req, res) => {
  const { username } = req.params;
  const { _id } = req.user;
  const chef = await Chefs.findOne({ _id, username });
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
      });
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
      const {
        title,
        ingredients,
        description,
        cuisine,
        dishType,
        images,
        price,
      } = req.body;

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

module.exports = chefControllers;
