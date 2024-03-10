// Import required modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const initializePassport = require("../passport-config");
const userModel = require("../models/user-model");

// Middleware setup
router.use(express.urlencoded({ extended: false }));
router.use(flash());
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride("_method"));

// Initialize passport
initializePassport(
  passport,
  email => userModel.findOne({ email: email }),
  id => userModel.findById(id)
);

// Login route
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs", { messages: { error: req.flash('error') } });
});

// Login form submission
router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/user/login",
  failureFlash: true
}));

// Registration route
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { messages: req.flash() });
});

// Registration form submission
router.post('/register', checkNotAuthenticated, async (req, res, next) => {
  let { referredCode } = req.body;

  try {
      const existingUser = await userModel.findOne({ email: req.body.email });
      if (existingUser) {
          req.flash('error', 'Email already in use');
          return res.redirect("/user/register");
      } else {
        
          if (referredCode) {
            const brokerExists = await userModel.findOne({ brokerCode: referredCode });
            if (!brokerExists) {
                req.flash('error', 'Incorrect Broker Code');
                return res.redirect("/user/register");
            }
          } else {
            referredCode = "00000000000";
          }
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          try {
              const brokerCode = await generateUniqueBrokerCode(userModel); // Attempt to generate unique code
              const user = new userModel({
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  email: req.body.email,
                  password: hashedPassword,
                  brokerCode: brokerCode,
                  referredCode: referredCode
              });
              await user.save();
              req.login(user, function(err) {
                  if (err) return next(err);
                  return res.redirect("/");
              });
          } catch (error) {
              req.flash('error', error.message); // Inform the user to contact technical support
              return res.redirect("/user/register");
          }
      }
  } catch {
      sreq.flash('error', 'Failed to create user. Please contact technical support.');
      res.redirect("/user/register");
  }
});

// Profile Route
router.get("/profile", checkAuthenticated, (req, res) => {
  const user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    brokerCode: req.user.brokerCode
  };
  const passwordChanged = req.session.passwordChanged;
  res.render("profile.ejs", { user, messages: req.flash(), passwordChanged });
});

// Password Change Route
router.post('/changePassword', checkAuthenticated, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/user/profile');
  }

  const user = await userModel.findById(req.user._id);

  if (!user || !await bcrypt.compare(currentPassword, user.password)) {
      req.flash('error', 'Incorrect current password.');
      return res.redirect('/user/profile');
  }

  try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      req.flash('success', 'Password changed successfully.');
      req.session.passwordChanged = true; // Prevent changing password again in the same session
      res.redirect('/user/profile');
  } catch (error) {
      console.error(error);
      req.flash('error', 'There was an error changing your password. Please reach out to support.');
      res.redirect('/user/profile');
  }
});

// Logout route
router.delete('/logout', checkAuthenticated, (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/user/login');
  });
});

// Catch all other routes
router.all("*", checkAuthenticated, (req, res) => {
  res.redirect("/user/login");
});

// Middleware function to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/user/login");
  }
}

// Middleware function to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  } else {
    return next();
  }
}

// Function to Generate Broker Code
async function generateUniqueBrokerCode(userModel) {
  const maxAttempts = 500;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const randomPart = Math.random().toString(36).substring(2, 2 + 6).toUpperCase();
      const code = "RAVE-" + randomPart;
      const existingUser = await userModel.findOne({ brokerCode: code });
      if (!existingUser) {
          return code;
      }
  }
  // If the function fails to generate a unique code after many attempts
  throw new Error('Failed to generate a unique broker code. Please contact technical support.');
}

module.exports = router;