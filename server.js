// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Import required modules
const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// Set the port and connection string from environment variables
const PORT = process.env.PORT;
const CONNECTION = process.env.CONNECTION;

// Disable strict mode for queries in mongoose
mongoose.set("strictQuery", false);

// Set the view engine to EJS
app.set("view-engine", "ejs");

// Configure middleware
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define the home route
app.get("/", checkAuthenticated, (req, res) => {
    res.render("home.ejs");
});

// Middleware function to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/user/login");
  }
}

// User router
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// Clients router
const clientsRouter = require("./routes/clients");
app.use("/clients", clientsRouter);

// Catch all other routes and redirect to the home page
app.all("*", (req, res) => {
    res.redirect("/");
});

// Start the server
(async function start() {
    try {
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log("App listening on port: " + PORT);
        });
    } catch (err) {
        console.log(err.message);
    }
})();