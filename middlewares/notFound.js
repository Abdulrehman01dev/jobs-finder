const statuscodes  = require('http-status-codes')

const notFound = async (req, res) =>{
    return res.status(statuscodes.NOT_FOUND).json({msg:'This route does not exist!'});
}

module.exports = notFound;
