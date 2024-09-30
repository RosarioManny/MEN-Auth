const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const authController = require("./controllers/auth.js");
const session = require('express-session');
const MongoStore = require("connect-mongo");


const PORT = process.env.PORT ? process.env.PORT : "3000"; // Set the port from environment variable or default to 3000

app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data from forms
app.use(methodOverride("_method")); // Middleware for using HTTP verbs such as PUT or DELETE
app.use(morgan('dev')); // Morgan for logging HTTP requests
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    })
);

//ROUTES BELOW
app.use("/auth", authController); // #4 Prepends the routes

app.get("/", async (req, res) => { // #2 Created Landing page and made a views folder. Create index.ejs file inside w/ HTML.
    res.render("index.ejs", {
      user: req.session.user, //#10 Linked this to the sessions made in controllers/auth.js
    });
});
  
  // #3 Next Make a User Model. Make model folder. Make user.js. Go there.
  // #4 Create a controllers folder. Create a auth.js inside. Go there.


app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
      res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
      res.send("Sorry, no guests allowed.");
    }
});
// #13 Created a resticted route where only validated users can be. VIP Lounge

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);

    app.listen(PORT, () => {
        console.log(`The express app is ready on PORT ${PORT}!`);
    });
});
