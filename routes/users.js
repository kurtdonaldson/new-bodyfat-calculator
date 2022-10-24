const express = require("express");
const router = express.Router();
// handling errors use catch
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

//Route to register page
router.get("/register", (req, res) => {
  res.render("users/register");
});

// registering a new user.
// in order to login user when registering, we use a helper method on passport.
// We register user. This saves to database and hashes the password. Then we take user and log them in. Then redirect and flash. We can't use passport.authenticate middleware as we haven't created user yet.
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "WELCOME TO THE BODYFAT CALCULATOR!");
        res.redirect("/");
      });
    } catch (e) {
      console.log(e.message);
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

// logging in client
router.get("/login", (req, res) => {
  res.render("users/login");
});

//passport.authenticate uses middleware, Expects strategy e.g. local.
//
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/");
  }
);

// logging out
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/login");
  });
});

module.exports = router;
