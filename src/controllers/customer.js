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

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
