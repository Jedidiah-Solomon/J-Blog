const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const axios = require("axios");

const {
  insertAgriculturePosts,
  insertHealthPosts,
  insertTechPosts,
} = require("../../postSender");

/**
 * GET /
 * HOME
 */
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog | By Jedidiah",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let perPage = 10;
    let page = parseInt(req.query.page) || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = page + 1;
    const previousPage = page - 1 > 0 ? page - 1 : null;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      previousPage: previousPage,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Post - searchTerm
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * About
 */
router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

/**
 * GET /
 * Contact
 */
router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

/**
 * POST /
 * Subscribe
 */
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const formspreeUrl = "https://formspree.io/f/xpwawpbg";

  try {
    const response = await axios.post(
      formspreeUrl,
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      res.json({ result: "success" });
    } else {
      res.status(400).json({ result: "error", message: response.statusText });
    }
  } catch (error) {
    res.status(500).json({ result: "error", message: error.message });
  }
});
//--------Use mailchimp or database if you like, or just use formspree-------//

/**
 * GET /
 * Paystack Payment Handler
 */
router.get("/api/paystack-key", (req, res) => {
  res.json({ key: process.env.PAYSTACK_PUBLIC_KEY });
});

// -----------------------------Call the functions to insert posts Mnaually from code on server------------------------------//
// insertAgriculturePosts();
// insertHealthPosts();
// insertTechPosts();

module.exports = router;
