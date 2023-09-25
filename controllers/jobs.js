
const { StatusCodes } = require('http-status-codes');
const job = require('../models/jobs'); 
const { NotFoundError , BadRequestError } = require('../errors'); 
const multer = require('multer');
const user = require('../models/user');
var cloudinary = require('cloudinary').v2;
const fs = require('fs')
const bcrypt = require('bcryptjs')

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:  process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const createJob = async(req, res) =>{
    req.body.createdBy = req.user.userID;
    
    const result = await job.create(req.body);

    res.status(StatusCodes.CREATED).json({ result });
}



const getAllJobs = async(req, res) =>{

  const  { limit = 10, offset = 0, searchColumn, searchString, sort } = req.query;

  const queryData= {};

  if(searchColumn && searchString){

    if(searchColumn==='salery'){
      queryData.priceRange =  { $gte: searchString, $lte: searchString }
      console.log(queryData);
    }
    else{
      queryData[searchColumn] = {$regex: searchString, $options:'i'};
    }
  }

  let result =  job.find(queryData).skip(parseInt(offset)).limit(parseInt(limit));

  if(sort){
    let sortdata = sort.split('_')
    let data = sortdata[1] === 'asyn' ? sortdata[0] : `-${sortdata[0]}`
    result.sort(data)
  }
  else{
    result.sort('-createdAt')
  }

  const jobList = await result
  // const filteredItems = await job.countDocuments(queryData);
  const totalItems = await job.countDocuments(queryData);
  res.status(StatusCodes.OK).json({result:jobList, totalItems});
}



const getMyJobs = async(req, res) =>{
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  
  const result = await job.find({createdBy: req.user.userID}).sort('-createdAt').skip(offset).limit(limit);
  const totalItems = await job.find({createdBy: req.user.userID}).count();
  res.status(StatusCodes.OK).json({result, totalItems, filteredItems: result.length});
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
        const allowedKeys = ['name', 'email', 'password', 'profile_photo', 'address', 'company', 'public_id'];
        const cleanData = {};

        if(req.file){

          if(userInfo.profile_photo){
            await cloudinary.uploader.destroy(userInfo.public_id); 
          }

          const result = await cloudinary.uploader.upload(req.file.path);
          console.log(result);
          cleanData.profile_photo =  result.secure_url;
          cleanData.public_id =  result.public_id;
          if(fs.existsSync('tmp/'+req.file.filename)){
            fs.unlinkSync('tmp/'+req.file.filename);
          }
        }


        allowedKeys.map(ele =>{
        if(data[ele]!==null && data[ele]!==undefined && data[ele]!==''){
            cleanData[ele] = data[ele]
        }})
        

        
        if(cleanData.password){
          const password = userInfo.password;
          const comparePassword = await userInfo.comparePassword(data.old_password);
          if (!comparePassword) {
            throw new BadRequestError("Invalid Credentials");
          }
          let salt = await bcrypt.genSalt(10);
          cleanData.password = await bcrypt.hash(data.password, salt);
        }


    
        let result = await user.findByIdAndUpdate({_id : req.user.userID}, {...cleanData}, {runValidators: true, new: true})
    
        return res.status(StatusCodes.OK).json({result});

    }

    throw new BadRequestError('Invalid User!');
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