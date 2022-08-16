const UserModel = require('../models/user').User;
const dishModel = require('../Models/dish');
const evaluationModel = require('../models/evaluation');

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.find({ username, role: 'customer' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the user updated data from the request body
    const updatedUserData = req.body;

    // the findByIdAndUpdate() will make sure the dish exists before updating it
    // the { new: true } here is just to tell mongoose we want the newly updated dish back after the update is complete
    const updatedPost = await UserModel.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    if (updatedPost) {
      res.status(200).json(updatedPost);
    }
  } catch (err) {
    // res.setHeader("Content-Type", /json/);
    res.status(422).json({ message: err.message });
  }
};

// todo : delete all related objects when deleting a customer
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser)
      res.status(404).json({ message: `User with id ${id} not found` });
    else res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const { customerId } = req.params;
    const newLocation = req.body;

    const user = await UserModel.findById(customerId);

    user.locations.push(newLocation);
    user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLcationsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;

    const user = await UserModel.findById(customerId);

    // retuns all locations as an array of objects

    res.status(200).json(user.locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    const { customerId, locationId } = req.params;

    const user = await UserModel.findById(customerId);

    // get the index of the location with the given id
    /* eslint no-underscore-dangle: 0 */
    const locationIndex = user.locations.findIndex(
      (location) => location._id.toString() === locationId.toString()
    );

    const location = user.locations[locationIndex];
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLocationById = async (req, res) => {
  try {
    const { customerId, locationId } = req.params;
    const user = await UserModel.findById(customerId);

    // get the index of the location with the given id
    /* eslint no-underscore-dangle: 0 */
    const locationIndex = user.locations.findIndex(
      (location) => location._id.toString() === locationId.toString()
    );

    // open an empty set for holding new values from req
    const updateSet = {};

    // assign each new value to the empty set
    const obj = user.locations[locationIndex].toObject();

    Object.keys(obj).forEach((key) => {
      if (!req.body[key]) {
        updateSet[`${key}`] = user.locations[locationIndex][`${key}`];
      } else {
        updateSet[`${key}`] = req.body[key];
      }
    });

    // update the location object reached by the index
    user.locations[locationIndex] = updateSet;
    user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLocationById = async (req, res) => {
  try {
    const { customerId, locationId } = req.params;

    const user = await UserModel.findById(customerId);

    // get the index of the location with the given id
    /* eslint no-underscore-dangle: 0 */
    const locationIndex = user.locations.findIndex(
      (location) => location._id === locationId
    );

    // delete the location object reached by the index
    user.locations.splice(locationIndex, 1);

    user.save();

    // return current locations
    const { locations } = user.locations;
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addRate = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { dishId, newRate } = req.body;
    const existedDish = dishModel.findOne({
      customer: customerId,
      id: dishId,
    });
    dishId.evaluation.rate.push(newRate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteRate = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { rateId, dishId } = req.body;

    //const user = await UserModel.findById(customerId);
    const Rate = await dishModel.evaluation.find({
      customer: customerId,
      dish: dishId,
    });

    if (Rate) {
      evaluationModel.deleteOne({ customer: customerId, dish_id: dishId });

      dishModel.save();

      res.send(Rate);
    } else {
      res.send('you do not have a rate to delete');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAllRates = async (req, res) => {
  try {
    const dishId = req.param;
    const Rates = await evaluationModel.find({ dish_id: dishId });
    res.status(200).json({ Rates });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getAllChef = async (req, res) => {
  try {
    const chefs = await UserModel.find({ role: 'chef' });
    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getchefName = async (req, res) => {
  try {
    const chefName = req.body;
    const chefs = await UserModel.find({ role: 'chef', username: chefName });
    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,

  // location
  createLocation,
  getAllLcationsByCustomerId,
  getLocationById,
  updateLocationById,
  deleteLocationById,
  //
  getchefName,
  getAllChef,
  deleteRate,
  addRate,
  getAllRates,
};
