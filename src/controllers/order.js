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
  const theDish = await dishModel.findById(dishid);

  let totalPrice = 0;
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

  if (!existedOrder || existedOrder.dishes.length < 1) {
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

    if (!customer.orders.includes(theOrder.id.toString())) {
      customer.orders.push(theOrder.id);
    }

    theOrder.total_price = theDish.price * quantity;

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

  // CALCULATE THE TOTAL PRICE

  existedOrder.dishes.forEach((elm) => {
    dishModel.findById(elm.dish.toString()).then(async (dishData) => {
      totalPrice += dishData.price * elm.quantity;
      existedOrder.total_price = totalPrice;
    });
  });

  if (!customer.orders.includes(existedOrder.id.toString())) {
    customer.orders.push(existedOrder.id);
  }
  await customer.save();
  return existedOrder.save().then(() => res.send(existedOrder));
};

// // UPDATE ORDER
orderControllers.updateOrder = async (req, res) => {
  const { customerid } = req.params;
  const { dishid, quantity } = req.body;
  let totalPrice = 0;

  const theOrder = await orderModel.findOne({
    customer: customerid,
    status: 'adding dishes',
  });

  theOrder.dishes.forEach((dish, index) => {
    if (dish.dish.toString() === dishid) {
      // UPDATING THE QUANTITY
      theOrder.dishes[index].quantity = quantity;
    }
  });

  // UPDATING THE TOTOAL PRICE
  theOrder.dishes.forEach((elm) => {
    dishModel.findById(elm.dish.toString()).then((dishData) => {
      totalPrice += dishData.price * elm.quantity;
      theOrder.total_price = totalPrice;
    });
  });

  // SAVING TO DB
  setTimeout(async () => {
    await theOrder.save();
    res.send(theOrder);
  }, 100);
};

// DELETE DISH FROM THE ORDER
orderControllers.deleteDish = async (req, res) => {
  const { customerid } = req.params;
  const { dishid } = req.body;
  const theOrder = await orderModel.findOne({
    customer: customerid,
    status: 'adding dishes',
  });
  let totalPrice = 0;

  if (theOrder) {
    // REMOVE DISH FROM THE DISHES ARRAY
    theOrder.dishes.forEach(async (elm, index) => {
      if (`${elm.dish.toString()}` === dishid) {
        theOrder.dishes.splice(index, 1);
      }
    });

    // RECALACULATE THE TOTAL PRICE IN ORDER
    theOrder.dishes.forEach((elm) => {
      dishModel.findById(elm.dish.toString()).then((dishData) => {
        totalPrice += dishData.price * elm.quantity;
        theOrder.total_price = totalPrice;
      });
    });
  } else {
    res.send('You dont have a dish to delete');
  }

  setTimeout(async () => {
    await theOrder.save();
    res.send(theOrder);
  }, 100);
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
