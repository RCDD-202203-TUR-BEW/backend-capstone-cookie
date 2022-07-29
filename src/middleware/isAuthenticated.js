const isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  return res.redirect('/api/auth/signin');
};

module.exports = isAuthenticated;
