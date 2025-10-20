const express = require("express");
const router=express.Router();
const User =require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userCountroller=require("../controllers/users.js");



router.route("/", (req, res) => {
    res.redirect("/login");
});
router.route("/signup")
.get(userCountroller.renderSignupForm)
.post(wrapAsync(userCountroller.signup));
router.route("/login")
.get(userCountroller.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true,}),userCountroller.login);

router.get("/logout",userCountroller.logout);
module.exports=router;