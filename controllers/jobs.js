
const { StatusCodes } = require('http-status-codes');
const job = require('../models/jobs'); 
const { NotFoundError, UnauthenticatedError } = require('../errors'); 
const multer = require('multer');
const user = require('../models/user');
const fs = require('fs');

const createJob = async(req, res) =>{
    req.body.createdBy = req.user.userID;
    
    const result = await job.create(req.body);

    res.status(StatusCodes.CREATED).json({ result });
}



const getAllJobs = async(req, res) =>{
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


const getProfile = async(req, res) =>{
    console.log(req.user.userID);
    const result = await user.findOne({ _id: req.user.userID});

    if (!result) {
      throw new NotFoundError(`Can't find User with id: ${jobID}`);
    }
    res.status(StatusCodes.OK).json({success : true, response: result})
}



const updateProfile = async (req, res) =>{

    const userInfo = await user.findById(req.user.userID);
    /// Check if user exists or not!

    if(userInfo){
        const data = req.body;
        const allowedKeys = ['name', 'email', 'password', 'profile_photo', 'address', 'company'];
        const cleanData = {};


        if(req.file){
          cleanData.profile_photo =  req.file.filename;
        }

        if(userInfo.profile_photo && cleanData.profile_photo){
          const filePath = `/tmp/${userInfo.profile_photo}`;

            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
        }
        

        /////  Checking file count!!!

        let fileCount = 0;
        const folderPath = '/tmp';
        fs.readdir(folderPath, (err, files) => {
            fileCount = files.filter(file => fs.statSync(`${folderPath}/${file}`).isFile()).length;
        });
        

        allowedKeys.map(ele =>{
        if(data[ele]){
            cleanData[ele] = data[ele]
        }})
    
        let result = await user.findByIdAndUpdate({_id : req.user.userID}, {...cleanData}, {runValidators: true, new: true})
    
        return res.status(StatusCodes.OK).json({result, fileCount:fileCount});
    }
    throw new UnauthenticatedError('Invalid User!')
  }
  
  
  const upload = multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb){
        cb(null, '/tmp')
      },
      filename: function(req ,file, cb){
        cb(null, 'avatar-'+file.fieldname+Date.now()+'.jpg')
      }
    })
  }).single('profile_photo')



module.exports = {
    createJob,
    deleteJob,
    getAllJobs,
    getMyJobs,
    updateJob,
    getJob,
    getProfile,
    updateProfile,
    upload,
  }