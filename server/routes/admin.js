const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Post = require("../models/Post");
const SecretAdminCode = require("../models/secretAdminCode");
const Register = require("../models/Register");
const { errorHandler } = require("../../middleware/errorHandlers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const adminLayoutRegister = "../views/layouts/admin_register";
const jwtSecret = process.env.JWT_SECRET;

/**
 *
 * Check Login
 */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

//-------------------------------------------//
/**
 * GET /register
 * Registration Page
 */
router.get("/register", async (req, res) => {
  try {
    const locals = {
      title: "Register",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("admin/admin_register", { locals, layout: adminLayoutRegister });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * POST /register
 * Handle Registration Form Submission
 */
// Register route
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

router.post("/register", async (req, res, next) => {
  try {
    const {
      username,
      email,
      phone,
      position,
      uniqueId,
      password,
      confirmPassword,
    } = req.body;

    // Basic validation
    if (
      !username ||
      !email ||
      !phone ||
      !position ||
      !uniqueId ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Additional password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol (!@#$%^&*)",
      });
    }

    // Check if the user already exists
    const existingUser = await Register.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Validate against admins_secret_code collection
    const adminCode = await SecretAdminCode.findOne({
      username,
      position,
      uniqueId,
    });
    if (!adminCode) {
      return res.status(400).json({ error: "Invalid admin credentials" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database using the Register model
    const newUser = new Register({
      username,
      email,
      phone,
      position,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
});

//----------------------------------------//

/**
 * GET /
 * Admin - Login Page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Check Login
 */
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Register.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials - No User found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials - Password incorrect!" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" } // Token expires in 1hr
    );

    // Simulating a delay of 1.5 seconds before redirecting
    setTimeout(() => {
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // Cookie expires in 3600 minutes (1hr)
        sameSite: "Strict",
      });

      res
        .status(200)
        .json({ message: "Login successful", username: user.username });
    }, 1500);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

//--------------------
/**
 * GET /
 * Admin Dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      username: req.user.username,
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});
//-----------------------------------//
/**
 * GET /
 * Admin - Create New Post
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Admin - Create New Post
 */
// POST route to add a new post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const { title, body, featureImg, requiredImg, optionalImg } = req.body;

    // Create a new Post object
    const newPost = new Post({
      title,
      body,
      featureImg,
      requiredImg,
      optionalImg,
    });

    // Save the new post to the database
    await newPost.save();

    res.status(200).json({ message: "Post added successfully!" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Check if Mongoose validation error occurred
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error. Please check your data format.",
      });
    }

    res.status(500).json({
      message: "Server Error. Unable to add post. Please try again later.",
    });
  }
});
/**
 * GET /
 * Admin - Edit Post
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const postId = req.params.id;
    console.log(`GET request Post id: ${postId}`); // Log the postId received

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID!" });
    }

    const data = await Post.findOne({ _id: postId });

    if (!data) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

/**
 * PUT /
 * Admin - Edit New Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(`Post id: ${postId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("Invalid Post ID format");
      return res.status(400).json({ message: "Invalid Post ID!!" });
    }

    console.log("Post ID is valid");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title: req.body.title,
        body: req.body.body,
        featureImg: req.body.featureImg,
        requiredImg: req.body.requiredImg,
        optionalImg: req.body.optionalImg,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      console.log("Post not found for the given ID");
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post updated successfully:", updatedPost);
    res.status(200).json({ message: "Post updated successfully!" });
  } catch (error) {
    console.log("Error occurred during update:", error);
    res.status(500).json({ message: "Server Error. Unable to update post." });
  }
});

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Logout
 */
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //res.json({ message: 'Logout successful.'});
  res.redirect("/");
});

// Register error handler middleware
router.use(errorHandler);

module.exports = router;
