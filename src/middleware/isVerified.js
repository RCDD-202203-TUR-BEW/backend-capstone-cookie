const customerModel = require('../models/user').User;

const isVerified = async (req, res, next) => {
  const user = await customerModel.findById(req.user.id);

  if (user.email_verified) return next();
  return res.status(403).json({ message: 'Your email have not verified yet' });
};

module.exports = isVerified;
