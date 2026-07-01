const mongoose = require('mongoose');

const url = 'mongodb+srv://yasminealyy:allthisends@cluster0.nuxgayy.mongodb.net/yelpcamp?retryWrites=true&w=majority&appName=Cluster0';

async function main() {
    console.log('Connecting to:', url);
    await mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');
}

// ADD THIS:
main()
  .then(() => process.exit(0))
  .catch(e => { console.log('FAILED:', e.message); process.exit(1); });