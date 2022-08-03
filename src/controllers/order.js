const orderControllers = {};
const orderModel = require('../models/order');
const dishModel = require('../models/dish');
const evaluationModel = require('../models/evaluation');

// GET CUSTOEMR ORDER
orderControllers.getCustomerOrder = async (req, res) => {
  const { customerid } = req.params;
  const customerOrder = await orderModel.findOne({ customer: customerid });
  res.json(customerOrder);
};

// GET ALL CUSTOMER PREVIOUS ORDERS
orderControllers.getAllPrevOrders = async (req, res) => {
  const { customerid } = req.params;
  const allCustomerOrders = await orderModel.find({ customer: customerid });
  res.json(allCustomerOrders);
};

// CREATE NEW ORDER
orderControllers.addNewOrder = async (req, res) => {
  const { customerid } = req.params;
  const { dishid, quantity } = req.body;

  const theDish = await dishModel.findById(dishid);
  const totalPrice = parseInt(theDish.price * quantity, 10);
  const theEvaluation = await evaluationModel.findOne({
    customer_id: customerid,
    dish_id: dishid,
  });

  // CREATE DISH AND QUANTITY PAIRS
  const dishAndQuantity = {
    dish: dishid,
    quantity,
  };

  // CREATE ORDER
  const theOrder = await orderModel.create({
    customer: customerid,
    total_price: totalPrice,
    paid: false,
  });

  if (theEvaluation) theOrder.evaluation = theEvaluation;
  theOrder.dishes.push(dishAndQuantity);
  await theOrder.save();

  res.json(theOrder);
};

module.exports = orderControllers;
