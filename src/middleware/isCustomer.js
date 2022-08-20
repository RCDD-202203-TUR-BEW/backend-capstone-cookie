const isCustomer = (req, res, next) => {
    if (req.user.role === 'customer') return next();
    //update the chef profile
   else return res.redirect(`/api/chefs/profile/${req.user.id}`);
    
  };
  
  module.exports = isCustomer;
  