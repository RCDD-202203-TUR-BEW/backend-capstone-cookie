const mongoose = require('mongoose');

const { Schema } = mongoose;

const LocationSchema = new Schema({
  locationName: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  quarter: {
    type: String,
    required: true,
  },
  block_num: {
    type: Number,
    required: true,
  },
  flat_num: {
    type: Number,
    required: true,
  },
  location_description: {
    type: String,
  },
});

const User = new Schema(
  {
    role: {
      type: String,
      enum: ['chef', 'customer', 'admin'],
    },

    // reference location schema as an array
    locations: [LocationSchema],

    firstname: {
      type: String,
      default: '',
    },

    lastname: {
      type: String,
      default: '',
    },

    username: {
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
      required: true,
      default: false,
    },

    password_hash: {
      type: String,
    },

    phone: {
      type: Number,
      // required: true,
      // the unique constraint is applied only if phone exists and is not null
      // ref: https://stackoverflow.com/questions/62169061/mongoerror-e11000-duplicate-key-error-collection-users-index-mobile-1-dup-key
      index: {
        unique: true,
        partialFilterExpression: { phone: { $type: 'number' } },
      },
    },

    avatar: {
      type: String,
    },

    birthday: {
      type: Date,
      default: '',
    },

    gender: {
      type: String,
      enum: ['female', 'male', 'not defined'],
      default: 'not defined',
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
