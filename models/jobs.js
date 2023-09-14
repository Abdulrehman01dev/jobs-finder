
const mongoose = require('mongoose');


const jobsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide Company Name!'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position!'],
        maxlength: 100
    },
    location: {
        type: String,
        required: [true, 'Please provide location!'],
        maxlength: 100
    },
    priceRange: {
        type: [Number],
        required: [true, 'Please provide priceRange!'],
    },
    skills: {
        type: [String],
        required: [true, 'Please provide skills!'],
    },
    jobType: {
        type: String,
        required: [true, 'Please provide jobType!'],
    },
    responsibilities: {
        type: [String],
        required: [true, 'Please provide responsibilities!'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: [true, 'Please provide the User!']
    }

}, {timestamps: true})


module.exports = mongoose.model('jobs', jobsSchema)



