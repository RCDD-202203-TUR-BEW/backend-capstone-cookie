const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema({
  coupon_code: {
    type: String,
    required: true,
    unique: true,
  },
  discount_type: {
    type: String,
    enum: ['coupon', 'percentage'],
  },
  discount_amount: { type: Number, required: true },
  active: { type: Boolean, default: true, required: true },

  expiration_date: Date,
});

const modelName = process.env.COUPON_MODEL_NAME;
module.exports = mongoose.model(modelName, couponSchema);
