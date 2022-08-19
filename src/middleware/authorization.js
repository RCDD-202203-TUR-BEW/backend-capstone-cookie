// middleware for doing role-based permissions
const permit =
  (...permittedRoles) =>
  // return a middleware
  (req, res, next) => {
    const { user } = req;

    if (user && permittedRoles.includes(user.role)) {
      next(); // role is allowed, so continue to the next middleware
    } else {
      res.status(403).json({ message: 'Forbidden' }); // user is forbidden
    }
  };

module.exports = permit;
