const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const memoryBenchSchema = new Schema({
    title: String,
    date: String,
    location: String,
    description: String
})


module.exports = mongoose.model('memoryBench', memoryBenchSchema);

