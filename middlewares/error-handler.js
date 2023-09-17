const statuscodes  = require('http-status-codes');
const { customApiError } = require('../errors');

const errorHandler = async (err, req, res, next) =>{ 
    console.log(err);
    if(err instanceof customApiError){
        return res.status(err.statusCode).json({ msg: err.message })
    }

    if(err.code && err.code===11000){ 
        return res.status(statuscodes.BAD_REQUEST)
        .json({msg: `This ${Object.keys(err.keyValue)} has already been exsist!`});
    }

    if(err.name==='ValidationError'){
        return res.status(statuscodes.BAD_REQUEST)
        .json({msg: Object.values(err.errors).map(ele => ele.message).join(', ')});
    }

    if(err.name==='CastError'){ 
        return res.status(statuscodes.NOT_FOUND)
        .json({msg: `Enter valid ID, No such item found with this id ${err.value}`});
    }

    if(err.statusCode===401 || err.code === 401){
        return res.status(statuscodes.UNAUTHORIZED).json({msg: `Invalid Credential`});
    }


    // return res.status(customError.statusCode).json({msg: customError.msg})
    return res.status(statuscodes.INTERNAL_SERVER_ERROR).json({err})

}

module.exports = errorHandler;
