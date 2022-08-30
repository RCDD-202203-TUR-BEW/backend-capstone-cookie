const UserModel = require('../models/user').User;
const storage = require('../db/storage');
const { getFileExtension } = require('../utils/utils');

const PROFILE_IMAGE_DIR = 'avatars';

const fetchUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    console.log(user);
    res.status(200).json(user.avatar);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });

    const user = await UserModel.findById(userId);
    const { avatar } = user;
    if (avatar) {
      const file = avatar.split('%2F')[1];
      const fileName = `${PROFILE_IMAGE_DIR}/${file}`;

      await storage.deleteImage(fileName);
      user.avatar = null;
      await user.save();
      res.status(200).json({ message: 'avatar deleted successfully' });
    } else {
      res.status(200).json({ message: 'no avatar to delete' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const uploadUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });

    const user = await UserModel.findById(userId);
    const { avatar } = user;
    let fileName;
    let imageUrl;
    if (req.file) {
      // chek if there is an avatar to delete
      if (avatar) {
        const file = avatar.split('%2F')[1]; // debug if there is no avatar uploaded when sign up
        fileName = `${PROFILE_IMAGE_DIR}/${file}`;
        imageUrl = await storage.updateImage(req.file, fileName, fileName);
      } else {
        fileName = `${PROFILE_IMAGE_DIR}/${user.id}.${getFileExtension(
          req.file.originalname
        )}`;
        imageUrl = await storage.uploadImage(req.file, fileName, fileName);
      }
      user.avatar = imageUrl;
      user.save();
      res.status(200).json({ message: 'avatar uploaded successfully' });
    } else {
      res.status(200).json({ message: 'no avatar to upload' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Location controllers
const createLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const newLocation = req.body;
    const { _id } = req.user;

    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });
    else {
      const user = await UserModel.findById(userId).populate('dishes');

      user.locations.push(newLocation);
      user.save();
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });
    else {
      const user = await UserModel.findById(userId);

      // returns all locations as an array of objects

      res.status(200).json(user.locations);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.params;
    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });
    else {
      const user = await UserModel.findById(userId);

      // get the index of the location with the given id
      /* eslint no-underscore-dangle: 0 */
      const locationIndex = user.locations.findIndex(
        (location) => location._id.toString() === locationId.toString()
      );

      const location = user.locations[locationIndex];
      if (location) res.json(location);
      else res.status(404).json({ message: 'invalid location id' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.params;

    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });
    else {
      const user = await UserModel.findById(userId);

      // get the index of the location with the given id
      /* eslint no-underscore-dangle: 0 */
      const locationIndex = user.locations.findIndex(
        (location) => location._id.toString() === locationId.toString()
      );

      if (locationIndex === -1)
        res.status(404).json({ message: 'invalid location id' });
      else {
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
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { userId, locationId } = req.params;
    const { _id } = req.user;
    if (_id !== userId)
      res
        .status(401)
        .json({ message: "You're not authorized to view this page" });
    else {
      const user = await UserModel.findById(userId);

      // get the index of the location with the given id
      /* eslint no-underscore-dangle: 0 */

      const locationIndex = user.locations.findIndex(
        (location) => location._id.toString() === locationId.toString()
      );
      if (locationIndex === -1)
        res.status(404).json({ message: 'invalid location id' });
      else {
        // delete the location object reached by the index
        user.locations.splice(locationIndex, 1);

        user.save();

        // return current locations
        const { locations } = user;
        res.status(200).json(locations);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchUserAvatar,
  deleteUserAvatar,
  uploadUserAvatar,
  createLocation,
  getSpecificLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
};
