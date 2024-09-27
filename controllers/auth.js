const express = require("express");
const router = express.Router();

module.exports = router;

// #4 This folder is going to handle the routes.

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
  });
  