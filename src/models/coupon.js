const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const couponSchema = new Schema({
    couopn_id: {
        type: Schema.Types.ObjectId,
        ref: process.env.COUPON_MODEL_NAME,
      },
 
 coupon_code: String,
 discount_type: {
    type: String,
    enum: [
      'coupon',
      'persentage',
     
    ],
  },
    discount_amount: Number,
    active: Boolean,
 
    expiration_date: Date,
  
  
});


module.exports = mongoose.model(modelName, couponSchema);
