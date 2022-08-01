const mongoose = require('mongoose');

const { Schema } = mongoose;
const evaluationSchema = require('./evaluation');

const dishQuantity = new Schema({
  dish: {
    type: Schema.Types.ObjectId,
    ref: process.env.DISH_MODEL_NAME,
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
});

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: process.env.USER_MODEL_NAME,
  },
  dishes: {
    type: [dishQuantity],
  },
  total_price: {
    type: Number,
    required: true,
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: process.env.COUPON_MODEL_NAME,
  },
  status: {
    type: String,
    enum: ['in preparation', 'completed', 'cancelled'],
    default: 'in preparation',
  },
  paid: {
    type: Boolean,
    required: true,
  },
  evaluation: evaluationSchema,
  order_date: {
    type: Date,
    default: Date.now(),
  },
});

const modelName = process.env.ORDER_MODEL_NAME;
module.exports = mongoose.model(modelName, orderSchema);
