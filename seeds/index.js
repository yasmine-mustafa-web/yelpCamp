const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');

const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpcamp' ;
mongoose.connect(dbUrl);
 
main().catch(err => {
    console.log(err);
console.log('there is an errorr');
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
console.log('connected')
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
 for (let i =0 ; i < 50 ; i++){
const random1000 = Math.floor(Math.random() *1000);
const price = Math.floor(Math.random() *20) + 10;
const camp = new Campground({
    author:'6a352b6d5c5e7448ffb1ba39',
    location:`${cities[random1000].city} , ${cities[random1000].state}`,
    title: `${sample(descriptors)} ${sample(places)}`,
    description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas autem perferendis labore obcaecati officia, quod at, dolorum error consectetur esse ipsum? Possimus deserunt rem vitae hic fugit modi ipsam. Consectetur!',
    price,
    geometry:{
        type:'Point',
        coordinates:[-113.1331,47.0202]
    },
    images:[
          {
    url: 'https://res.cloudinary.com/rwa7geih/image/upload/v1782251740/YelpCamp/sjfdvhdutrzxd4hm9573.png',
    filename: 'YelpCamp/sjfdvhdutrzxd4hm9573',
  },
  {
    url: 'https://res.cloudinary.com/rwa7geih/image/upload/v1782251741/YelpCamp/q7zcx1kqvkd48gjtgx1k.png',
    filename: 'YelpCamp/q7zcx1kqvkd48gjtgx1k',
  }
    ]

})
await camp.save();
 }
}

seedDB().then(()=>{
    mongoose.connection.close();
});