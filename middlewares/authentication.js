const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors"); 


const auth = async(req, res, next) =>{

    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Invalid!')
    };

    const token = authHeaders.split(' ') [1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {userID:payload.id, name:payload.name}
        
        /// Second approach to get current user!
        // const currUser = await user.findById(payload.id).select('-password'); 
        // req.user = currUser;
        next();

    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid!')
    }

}

module.exports = auth;

