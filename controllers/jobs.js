
const { StatusCodes } = require('http-status-codes');
const job = require('../models/jobs'); 
const { NotFoundError } = require('../errors'); 

const createJob = async(req, res) =>{
    req.body.createdBy = req.user.userID;
    
    const createJob = new job({
        company: req.body.company,
        position: req.body.position,
        createdBy: req.body.createdBy,

    })
    const result = await createJob.save();

    res.status(StatusCodes.CREATED).json({ result });
}



const getAllJobs = async(req, res) =>{
    
    const result = await job.find({ createdBy: req.user.userID }).sort('createdAt')
    res.status(StatusCodes.OK).json({result});

}



const getJob = async(req, res) =>{

    const {
      user: { userID },
      params: { id: jobID },
    } = req;

    const result = await job.findOne({ _id: jobID, createdBy: userID });
    
    if (!result) {
      throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({Success : true, response: result})
}



const deleteJob = async(req, res) =>{

    const {user:{ userID }, params:{id: jobID}} = req;

    const result = await job.findByIdAndDelete({_id: jobID ,createdBy: userID});

    if (!result) {
        throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({success: true});
}



const updateJob = async(req, res) =>{
    const {user:{ userID }, params:{id: jobID}, body: { company, position }} = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }

    const result = await job.findByIdAndUpdate({_id: jobID ,createdBy: userID}, req.body, {runValidators: true, new: true});

    if (!result) {
        throw new NotFoundError(`Can't find job with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({response:result});
}


module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    getJob,
  }