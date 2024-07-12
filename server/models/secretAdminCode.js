const mongoose = require("mongoose");

const SecretAdminCodeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: "admins_secret_code" }
); // Explicitly set the collection name, mongodb will pluralize the collection name you pass, so admin = admins when you run code

const SecretAdminCode = mongoose.model(
  "newColectionNotNeeded",
  SecretAdminCodeSchema
);

module.exports = SecretAdminCode;
