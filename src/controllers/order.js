const orderControllers = {};
const orderModel = require('../models/order');

// GET CUSTOEMR ORDER
orderControllers.getCustomerOrder = async (req, res) => {
  const { customerid } = req.params;
  const customerOrder = orderModel.findOne({ customer: customerid });
  res.json(customerOrder);
};

// GET ALL CUSTOMER PREVIOUS ORDERS
orderControllers.getAllPrevOrders = async (req, res) => {
  const { customerid } = req.params;
  const allCustomerOrders = orderModel.find({ customer: customerid });
  res.json(allCustomerOrders);
};

module.exports = orderControllers;
