const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
      enum: ["Nigerian"],
      default: "Nigerian",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bvn: {
        type: String,
        default: null
    },
    securityPin: {
        type: String,
        default: null
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpire: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
