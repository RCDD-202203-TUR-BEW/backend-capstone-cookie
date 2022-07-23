const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const evaluationSchema = require('./evaluation');

const dishSchema = new Schema({
  chef_id: {
    type: Schema.Types.ObjectId,
    ref: process.env.CHEF_MODEL_NAME,
  },
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  description: String,
  cuisine: {
    type: String,
    enum: [
      'turkish',
      'asian',
      'japanese',
      'italian',
      'american',
      'indian',
      'mexican',
    ],
  },
  dish_type: {
    type: String,
    enum: [
      'appetizer',
      'main dish',
      'dessert',
      'soup',
      'salad',
      'pizza',
      'burger',
      'pasta',
      'sandwich',
    ],
  },
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  evaluation: evaluationSchema,
  edited_at: Date,
});

const modelName = process.env.DISH_MODEL_NAME;
module.exports = mongoose.model(modelName, dishSchema);
