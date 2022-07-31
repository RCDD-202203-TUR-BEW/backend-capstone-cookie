const mongoose = require('mongoose');
const location = require('./location');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['chef', 'customer', 'admin'],
    },

    locations: [location],

    firstname: {
      type: String,
      unique: false,
      required: true,
    },

    lastname: {
      type: String,
      unique: false,
      required: true,
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
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
    },

    birthday: {
      type: Date,
      required: true,
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

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

const modelName = process.env.USER_MODEL_NAME;
module.exports = mongoose.model(modelName, UserSchema);
