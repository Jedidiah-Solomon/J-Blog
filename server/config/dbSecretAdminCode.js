require("dotenv").config();
const mongoose = require("mongoose");
const SecretAdminCode = require("../models/secretAdminCode");

const { MONGODB_URI, MONGODB_PASSWORD } = process.env;

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Admin data to insert
const admins = [
  {
    username: "john_doe",
    firstName: "John",
    lastName: "Doe",
    position: "CEO",
    uniqueId: "J-blog/John/Doe/CEO/1",
  },
  {
    username: "jane_smith",
    firstName: "Jane",
    lastName: "Smith",
    position: "Editor",
    uniqueId: "J-blog/Jane/Smith/Editor/1",
  },
  {
    username: "emily_jones",
    firstName: "Emily",
    lastName: "Jones",
    position: "Editor",
    uniqueId: "J-blog/Emily/Jones/Editor/2",
  },
  {
    username: "michael_brown",
    firstName: "Michael",
    lastName: "Brown",
    position: "Editor",
    uniqueId: "J-blog/Michael/Brown/Editor/3",
  },
  {
    username: "david_williams",
    firstName: "David",
    lastName: "Williams",
    position: "Staff",
    uniqueId: "J-blog/David/Williams/Staff/1",
  },
  {
    username: "sarah_taylor",
    firstName: "Sarah",
    lastName: "Taylor",
    position: "Staff",
    uniqueId: "J-blog/Sarah/Taylor/Staff/2",
  },
  {
    username: "robert_anderson",
    firstName: "Robert",
    lastName: "Anderson",
    position: "Staff",
    uniqueId: "J-blog/Robert/Anderson/Staff/3",
  },
  {
    username: "jessica_lee",
    firstName: "Jessica",
    lastName: "Lee",
    position: "Staff",
    uniqueId: "J-blog/Jessica/Lee/Staff/4",
  },
  {
    username: "james_wilson",
    firstName: "James",
    lastName: "Wilson",
    position: "Staff",
    uniqueId: "J-blog/James/Wilson/Staff/5",
  },
  {
    username: "laura_martinez",
    firstName: "Laura",
    lastName: "Martinez",
    position: "Staff",
    uniqueId: "J-blog/Laura/Martinez/Staff/6",
  },
];

// Function to add admin documents
async function addAdmins() {
  try {
    await SecretAdminCode.insertMany(admins);
    console.log("Admins added successfully");
  } catch (error) {
    console.error("Error adding admins:", error);
  } finally {
    mongoose.connection.close(); // Close MongoDB connection
  }
}

// Call function to add admins
addAdmins();

//node server/config/dbSecretAdminCode.js

//Add a secret code to validate admins. This can be done from another database
