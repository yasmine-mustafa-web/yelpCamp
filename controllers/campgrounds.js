const Campground = require('../models/campground');
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken =process.env.MAPBOX_TOKEN;
const geoCoder =mbxGeoCoding({accessToken:mapBoxToken});
const {CloudinaryStorage} = require ('multer-storage-cloudinary');


module.exports.index = async (req, res) => {
    try{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
    }catch(e){
        res.status(500).send(e.message);
        console.log(e);
    }
   
}


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    try{
    const geoData =   await geoCoder.forwardGeoCode({
            query:req.body.campground.location,
            limit:1
        }).send()
        const campground = new Campground(req.body.campground);
        campground.geometry = geoData.body.features[0].geometry;
        campground.images = req.files.map(f => ({
            url:f.path,
            filename:f.filename
        }));
        campground.author = req.user._id;
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);

    } catch(e){
        console.error("ERROR:", e);
        res.status(500).send(e.message);
    }
}

module.exports.showCampground = async (req, res, next) => {
    try{
    const campground = await Campground.findById(req.params.id).populate({path:'reviews' , populate:{path:'author'}}).populate('author');
    console.log(campground);
    if(!campground){
    req.flash('error' , 'no campground is existed');
    return res.redirect('/campgrounds')
   }
    console.log(campground.images);
    res.render('campgrounds/show', { campground });
    }
 catch(e){
    console.log(e);
 }

}

module.exports.renderEditForm= async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'this campground does not exist')
        return res.redirect('/campgrounds')
    }
  
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground =async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    const imgs = req.files.map(f => ({
            url:f.path,
            filename:f.filename}))
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename);
        }
         await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})

    }
    req.flash('success', 'successfuly upgrade a new campground');
    res.redirect('/campgrounds');
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'successfuly deleted a campground');

    res.redirect(`/campgrounds`);

}