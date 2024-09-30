const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require('bcrypt')
const MongoStore = require("connect-mongo");

// #4 This folder is going to handle the routes.

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
  
// #4a Created folders and files to auth/sign-up. Go there.

router.post("/sign-up", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.send("Username already taken.");
        }
        if (req.body.password !== req.body.confirmPassword) {
            return res.send("Password and Confirm Password must match");
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 10); // <- This creates the new Hased pw and is put in a string
            req.body.password = hashedPassword; // <- We are now making it so that the password and hashed version are the same. 
            
            const user = await User.create(req.body);
            res.send(`Thanks for signing up ${user.username}`);
            
        req.session.user = {
            username: user.username,
        };
              
        req.session.save(() => {
            res.redirect("/");
        });
              
});
  
// #6 Created the Post route for signup. Imported user into a variable
// #6a Creating Authorization to have a unique Username and same password

// #7 Installing bcrypt. Putting in security safety. That is a hashing package.

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

// #8 Created GET Sign-in page 

router.post("/sign-in", async (req, res) => {
    // Get user from Database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    } 
    // There is a User! Time t otest their PW w/ bcrypt
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      if (!validPassword) {
        return res.send("Login failed. Please try again.");
      }
          
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = { 
        username: userInDatabase.username,
        // _id: userInDatabase._id
    } // #9a Installed express-session and created some validation.

    req.session.save(() => {
        res.redirect("/");
});


router.get("/sign-out", async (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
      });
    });
});
  
// #12 Created a Sign-out route. To close a session(Being Signed-in) is to delete/destroy session
// Right now this literally destroys the user as well. Will fix later

  
// #9 Created POST Sign-in.

module.exports = router;

