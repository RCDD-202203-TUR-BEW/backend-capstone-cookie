const Users = require('../models/user').User;
const Chefs = require('../models/user').Chef;

const chefControllers = {};

chefControllers.getAllChefs = async (req, res) => {
  const chefs = await Chefs.find({});
  if (!chefs) return res.json({ message: 'No chefs to show at this time' });
  return res.json(chefs);
};

chefControllers.getSpecificChef = async (req, res) => {
  const { username } = req.params;
  const chef = await Users.findOne({ username });
  if (!chef) return res.json({ message: `No chef with username: ${username}` });
  return res.json(chef);
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
    res.json({ error: err });
  }
};

module.exports = chefControllers;
