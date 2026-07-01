const mongoose = require('mongoose');
const { type } = require('node:os');
const { ref } = require('node:process');
const { reviewSchema } = require('../schemas');
const schema = mongoose.Schema;

const imgSchema = new schema({
            url:String,
            filename:String
})
imgSchema.virtual('thumbnail').get(function(){
return this.url.replace('/upload' , '/upload/w_200');
})
const campgroundSchema = new schema ({
    title:{
        type:String,
        //required:true
    },
    images:[imgSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        } ,
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:{
        type:Number,
       // required:true,
        min:0
    },
    description:{
        type:String,
       // required:true
    },
    location:{
        type:String,
       // required:true
    },
    author:{
        type:schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
         type: schema.Types.ObjectId,
         ref:'Review'

        }
    ]
})

campgroundSchema.post('findOneAndDelete' , async function(doc){
if (doc){
    await Review.deleteMany({
        _id:{
            $in: doc.reviews
        }
    })
}
})

module.exports = mongoose.model('Campground' , campgroundSchema );