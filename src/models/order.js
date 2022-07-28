const mongoose = require('mongoose');

const { Schema } = mongoose;
const evaluationSchema = require('./evaluation');

const orderSchema = new Schema({
  dish: {
    type: Schema.Types.ObjectId,
    ref: process.env.DISH_MODEL_NAME,
  },
  quantity: Number,
  total_price: Number,
  coupon: {
    type: Schema.Types.ObjectId,
    ref: process.env.COUPON_MODEL_NAME,
  },
  price_after_discount: Number,
  status: {
    type: String,
    enum: ['in preparation', 'completed', 'cancelled'],
  },
  paid: Boolean,
  evaluation: evaluationSchema,
  order_date: Date,
});

const modelName = process.env.ORDER_MODEL_NAME;
module.exports = mongoose.model(modelName, orderSchema);
