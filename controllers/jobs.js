
const { StatusCodes } = require('http-status-codes');
const job = require('../models/jobs'); 
const { NotFoundError } = require('../errors'); 

const createJob = async(req, res) =>{
    req.body.createdBy = req.user.userID;
    
    const result = await job.create(req.body);

    res.status(StatusCodes.CREATED).json({ result });
}



const getAllJobs = async(req, res) =>{
    console.log(req.query);
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    
    const result = await job.find().sort('createdAt').skip(offset).limit(limit)
    res.status(StatusCodes.OK).json({result});
}

const getMyJobs = async(req, res) =>{
    res.status(StatusCodes.OK).json({result});
}



const getJob = async(req, res) =>{

    const {
    //   user: { userID },
      params: { id: jobID },
    } = req;

    const result = await job.findOne({ _id: jobID});

    if (!result) {
      throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({success : true, response: result})
}



const deleteJob = async(req, res) =>{

    const {user:{ userID }, params:{id: jobID}} = req;

    const result = await job.findByIdAndDelete({_id: jobID});

    if (!result) {
        throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({success: true});
}



const updateJob = async(req, res) =>{
    const {user:{ userID }, params:{id: jobID}} = req;

    // if (company === '' || position === '') {
    //     throw new BadRequestError('Company or Position fields cannot be empty')
    // }

    const result = await job.findByIdAndUpdate({_id: jobID }, req.body, {runValidators: true, new: true});

    if (!result) {
        throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({response:result});
}


module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    getMyJobs,
    updateJob,
    getJob,
  }