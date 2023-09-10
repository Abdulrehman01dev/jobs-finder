
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
    status: {
        type: String,
        enum: ['interview', 'pending', 'declined'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: [true, 'Please provide the User!']
    }

}, {timestamps: true})


module.exports = mongoose.model('jobs', jobsSchema)



