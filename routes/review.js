const express = require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpresError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");

const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewCountroller=require("../controllers/reviews.js")
//review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewCountroller.createReview));


// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewCountroller.deleteReview));
module.exports=router;