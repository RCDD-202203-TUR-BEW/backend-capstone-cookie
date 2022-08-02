const mongoose = require('mongoose');
const location = require('./location');

const { Schema } = mongoose;

const User = new Schema(
  {
    role: {
      type: String,
      enum: ['chef', 'customer', 'admin'],
    },

    locations: [location], //   location is not defined yet

    first_name: {
      type: String,
      unique: false,
      requied: true,
    },

    last_name: {
      type: String,
      unique: false,
      requied: true,
    },

    user_name: {
      type: String,
      match: [
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        /^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        `invalid username`,
      ],
      required: true,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9\-_.]+@[a-z]+\.([a-z]{2,3})+(\.[a-z]{2,3})?$/,
        `invalid email`,
      ],
      required: true,
      unique: true,
      lowercase: true,
    },

    email_verified: {
      type: Boolean,
      requied: true,
    },

    password_hash: {
      type: String,
      required: false,
    },

    phone: {
      type: Number,
      requied: true,
      unique: true,
    },

    avatar: {
      type: String,
    },

    birthday: {
      type: Date,
      requied: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ['female', 'male', 'non-binary defined'],
    },
    provider: {
      type: String,
      enum: ['email', 'google', 'twitter'],
      default: 'email',
      required: true,
    },
    providerId: {
      type: String,
    },
  },
  { timestamps: true },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

User.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

const modelName = process.env.USER_MODEL_NAME;
const UserModel = mongoose.model(modelName, User);

const ChefModel = UserModel.discriminator(
  'Chef',
  new Schema({
    kitchen_name: {
      type: String,
      unique: true,
      required: true,
    },
    kitchen_description: {
      type: String,
      default: '',
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    dishes: {
      type: [Schema.Types.ObjectId],
      ref: process.env.DISH_MODEL_NAME,
      default: [],
    },
    average_rate: {
      type: Number,
      default: 0,
    },
  })
);

const CustomerModel = UserModel.discriminator(
  'Customer',
  new Schema({
    orders: {
      type: [Schema.Types.ObjectId],
      ref: process.env.ORDER_MODEL_NAME,
      default: [],
    },
  })
);

const AdminModel = UserModel.discriminator(
  'Admin',
  new Schema({
    permissions: {
      type: [String],
      enum: ['create', 'create/update', 'create/update/delete'],
    },
    is_main_admin: {
      type: Boolean,
      default: false,
    },
  })
);

module.exports = {
  User: UserModel,
  Chef: ChefModel,
  Customer: CustomerModel,
  Admin: AdminModel,
};
