const mongoose = require('mongoose');

const { Schema } = mongoose;

const evaluationSchema = new Schema({
  dish_id: {
    type: Schema.Types.ObjectId,
    ref: process.env.DISH_MODEL_NAME,
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    ref: process.env.CUSTOMER_MODEL_NAME,
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = evaluationSchema;
