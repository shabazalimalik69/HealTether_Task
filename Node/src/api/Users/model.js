const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    profileImage: {
      url: {
        type: String,
      },
      key: {
        type: String,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
usersSchema.index({ email: 1 }, { unique: true });
usersSchema.index({ mobile: 1 });
usersSchema.index({ isDeleted: 1 });

const Users = mongoose.model("user", usersSchema);

module.exports = Users;
