const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport"); // ✅ ADD THIS
const { saveRedirectUrl } = require("../middleware.js");

const userController=require("../controllers/users.js");

router.route("/signup")
 .get(userController.renderSingupForm)
 .post( wrapAsync(userController.singup));

router.route("/login")
  .get( userController.renderLoginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login,
);



router.get("/logout",userController.logout);

module.exports = router;