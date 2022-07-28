const mongoose = require('mongoose');

const LocationSchema = mongoose.schemma({
  city: {
    type: String,
    requied: true,
  },
  district: {
    type: String,
    requied: true,
  },
  street: {
    type: String,
    requied: true,
  },
  quarter: {
    type: String,
  },
  block_num: {
    type: Number,
  },
  flat_num: {
    type: String,
    requied: true,
  },
  location_description: {
    type: String,
    requied: true,
  },
});

const modelName = process.env.LOCATION_MODEL_NAME;
module.exports = mongoose.model(modelName, LocationSchema);
