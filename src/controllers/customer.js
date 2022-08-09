const UserModel = require('../models/user').User;

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

const getAllLocations = async (req, res) => {
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

    const { data } = req.body;

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

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,

  // location
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
};
