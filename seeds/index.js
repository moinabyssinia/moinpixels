/* this is self-contained
   it's going to connect to mongoose and 
   will use the created model
*/

const mongoose = require('mongoose');

/* use ./ to access data from the same folder
   use ../ to access data from another folder
*/
const memoryBench = require('../models/memoryBench');
const cities = require('./cities') // get json file 

// import json files
const { places, descriptors } = require('./seedHelpers');

// connection stuff
mongoose.connect('mongodb://localhost:27017/emfrm-memorylane',{ 
    useNewUrlParser:true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// generate random city combinations
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await memoryBench.deleteMany({}); // clean up old data
    // to get random memory title names - helps to avoid redundancy in development
    for (let i = 0; i < 15; i++){
        const random1000 = Math.floor(Math.random() * 1000);

        // randomize for naming
        const randPlace = sample(places);
        const randDesc = sample(descriptors);

        const memory = new memoryBench({
            title : `${randDesc}_${randPlace}`,
            location : `${cities[i].city}, ${cities[i].state}`

        });
        await memory.save();

    }
} 

// execute and close the database connection
seedDB()
.then(() => {
    mongoose.connection.close()
});