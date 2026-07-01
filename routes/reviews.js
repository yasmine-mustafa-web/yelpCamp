const express = require('express');
const router = express.Router({mergeParams:true});
const ExpressError= require('../utills/expressError');
const catchAsync= require('../utills/catchAsync');
const Review=require('../models/reviews');
const Campground = require('../models/campground');
const { reviewSchema} = require('../schemas');
const {isLoggedIn , isAuthor , validateCampground , validatedReviews, isAuthorReview} = require('../middleware');
const reviews = require('../controllers/reviews');



router.post('/' , isLoggedIn , validatedReviews , catchAsync(reviews.createReview));

router.delete('/:reviewsId' , isLoggedIn , isAuthorReview , catchAsync(reviews.deleteReview));

module.exports = router;