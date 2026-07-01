const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utills/catchAsync');
const Campground = require('../models/campground');
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});
router.route('/')
.get( catchAsync(campgrounds.index))
.post(
    isLoggedIn,
    upload.array('image'),
    (req,res,next)=>{
        console.log("Files:",req.files);
        console.log("Body:",req.body);
        next();
    },
    validateCampground,
    catchAsync(campgrounds.createCampground)
);
router.get('/new', isLoggedIn , campgrounds.renderNewForm);


router.route('/:id')
.get( isLoggedIn , catchAsync(campgrounds.showCampground))
.put( isAuthor , isLoggedIn , upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete( isAuthor , isLoggedIn , catchAsync(campgrounds.deleteCampground));


router.get('/:id/edit', isAuthor , isLoggedIn, catchAsync(campgrounds.renderEditForm))


module.exports = router;