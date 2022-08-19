const orderControllers = {};
const orderModel = require('../models/order');
const dishModel = require('../models/dish');
const evaluationModel = require('../models/evaluation');
const customerModel = require('../models/user').User;

// GET THE LAST CUSTOEMR ORDER
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
  const customer = await customerModel.findById(customerid);

  const totalPrice = 0;
  // const theEvaluation = await evaluationModel.findOne({
  //   customer_id: customerid,
  //   dish_id: dishid,
  // });
  const theEvaluation = false;
  const existedOrder = await orderModel.findOne({
    customer: customerid,
    status: 'adding dishes',
  });

  // CREATE DISH AND QUANTITY PAIRS
  const dishAndQuantity = {
    dish: dishid,
    quantity,
  };

  if (!existedOrder) {
    // CREATE ORDER
    const theOrder = await orderModel.create({
      customer: customerid,
      total_price: totalPrice,
      paid: false,
    });

    // ADD DISH TO ORDER
    theOrder.dishes.push(dishAndQuantity);

    // ADD THE RATE TO THE ORDER
    if (theEvaluation) theOrder.evaluation = theEvaluation;

    customer.orders.push(theOrder.id);

    await customer.save();
    await theOrder.save();
    return res.json(theOrder);
  }

  // ADD NEW DISH TO EXISTED ORDER

  const result = existedOrder.dishes.every((e) => e.dish.toString() !== dishid);

  if (result) {
    existedOrder.dishes.push(dishAndQuantity);
  } else {
    existedOrder.dishes.forEach(async (elm, index) => {
      if (elm.dish.toString() === dishid) {
        existedOrder.dishes[index].quantity += parseInt(quantity, 10);
      }
    });
  }

  // ADD EVALUATION
  if (theEvaluation) existedOrder.evaluation = theEvaluation;

  await existedOrder.save();
  customer.orders.push(existedOrder.id);
  await customer.save();
  return res.send(existedOrder);
};

// // UPDATE ORDER
orderControllers.updateOrder = async (req, res) => {
  const { customerid } = req.params;
  const { dishid, quantity } = req.body;

  const theOrder = await orderModel.findOne({
    customer: customerid,
    status: 'adding dishes',
  });

  theOrder.dishes.forEach(async (dish, index) => {
    if (dish.dish === dishid) {
      theOrder.dishes[index].quantity = quantity;
      await theOrder.save();
    }
  });
  res.send(theOrder);
};

// DELETE ORDER
orderControllers.deleteOrder = async (req, res) => {
  const { customerid } = req.params;
  const theOrder = await orderModel.findOne({
    customer: customerid,
    status: 'adding dishes',
  });
  const customerOrder = await customerModel.findById(theOrder.customer);

  if (theOrder) {
    customerOrder.orders.forEach(async (elm, index) => {
      if (`${elm}` === `${theOrder.id}`) {
        customerOrder.orders.splice(index, 1);
        await customerOrder.save();
      }
    });
    await theOrder.delete();
    res.send(theOrder);
  } else {
    res.send('You dont have an order to delete');
  }
};

module.exports = orderControllers;
