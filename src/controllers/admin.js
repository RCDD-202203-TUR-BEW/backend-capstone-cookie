const UserModel = require('../models/user').User;

//  Controllers for fetching user different types by admin
const fetchAll = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};
const fetchCustomers = async (req, res) => {
  try {
    const customers = await UserModel.find({ role: 'customer' }).populate(
      'orders'
    );
    res.status(200).json({ customers });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const fetchChefs = async (req, res) => {
  try {
    const chefs = await UserModel.find({ role: 'chef' });
    res.status(200).json({ chefs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const fetchAdmins = async (req, res) => {
  try {
    const selfAdminId = req.params.id;

    const otherAdmins = await UserModel.find({
      /* eslint no-underscore-dangle: 0 */
      _id: { $ne: selfAdminId },
      role: 'admin',
    });
    res.status(200).json({ otherAdmins });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Controller for deleting user  by admin

// eslint-disable-next-line consistent-return
const deleteUser = async (req, res) => {
  try {
    // check for its main admin or not

    const userId = req.params.id;
    const mainAdmin = await UserModel.findOne({
      role: 'admin',
      is_main_admin: true,
    });

    /* eslint no-underscore-dangle: 0 */
    const mainAdminId = mainAdmin._id;

    if (mainAdminId.toString() === userId.toString()) {
      return res.status(400).json({ error: 'you can not delete main admin' });
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ deletedUser });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  fetchAll,
  fetchCustomers,
  fetchChefs,
  fetchAdmins,
  deleteUser,
};
