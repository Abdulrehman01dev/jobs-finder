const statuscodes  = require('http-status-codes');
const customApiError  = require('../errors/customApiError');

const errorHandler = async (err, req, res, next) =>{ 

    let customError = {
        statusCode: err.statusCode || statuscodes.INTERNAL_SERVER_ERROR,
        msg: err.msg || "Something went wrong try again later",
    }

    // if(err instanceof customApiError){
    //     return res.status(err.statusCode).json({ msg: err.message })
    // }

    if(err.code && err.code===11000){
        customError.msg = `This ${Object.keys(err.keyValue)} has already been exsist!`
        customError.statusCode = 400;
    }

    if(err.name==='ValidationError'){
        customError.msg = Object.values(err.errors).map(ele => ele.message).join(', ');
        customError.statusCode = 400; 
    }

    if(err.name==='CastError'){
        customError.msg =  `Enter valid ID, No such item found with this id ${err.value}`;
        customError.statusCode = 404;
    }

    if(err.statusCode===401 || err.code === 401){
        customError.msg =  `Invalid Credential`;
        customError.statusCode = 401;
    }


    return res.status(customError.statusCode).json({msg: customError.msg})
    // return res.status(statuscodes.INTERNAL_SERVER_ERROR).json({err})

}

module.exports = errorHandler;
