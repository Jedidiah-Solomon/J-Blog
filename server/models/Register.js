const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["CEO", "Editor", "Staff"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "admins_register", // Explicitly set the collection name
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("admins_register", RegisterSchema);
