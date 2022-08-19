const UserModel = require('../models/user').User;
const storage = require('../db/storage');
const { getFileExtension } = require('../utils/utils');

const PROFILE_IMAGE_DIR = 'avatars';

const fetchUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    res.status(200).json(user.avatar);
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
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
    const user = await UserModel.findById(userId);
    const { avatar } = user;
    if (req.file) {
      const file = avatar.split('%2F')[1]; // debug if there is no avatar uploaded when sign up
      const fileName = `${PROFILE_IMAGE_DIR}/${file}`;
      await storage.updateImage(req.file, fileName, fileName);

      res.status(200).json({ message: 'avatar uploaded successfully' });
    } else {
      res.status(200).json({ message: 'no avatar to upload' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  fetchUserAvatar,
  deleteUserAvatar,
  uploadUserAvatar,
};
