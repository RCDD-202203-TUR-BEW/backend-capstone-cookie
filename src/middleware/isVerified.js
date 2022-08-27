const isVerified = (req, res, next) => {
  if (req.user.email_verified) return next();
  return res.status(403).json({ message: 'Your email have not verified yet' });
};

module.exports = isVerified;
