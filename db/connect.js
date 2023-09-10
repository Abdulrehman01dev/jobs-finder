const mongoose = require('mongoose');

const connectDB = (url) =>{
   return mongoose.connect(url, { autoIndex: true })
}

module.exports = connectDB;

