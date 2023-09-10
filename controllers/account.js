const { StatusCodes } = require("http-status-codes");
const users = require("../models/user");
const { UnauthenticatedError } = require("../errors");



const register = async (req, res) => {
  let result = await users.create({ ...req.body });

  let token = result.Create_JWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    response: { user: result.name, id: result._id, token: token },
  });
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if ((!email || !password)) {
    throw new UnauthenticatedError("Please provide Email and Password");
  }

  let result = await users.findOne({ email });
  if (!result) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const comparePassword = await result.comparePassword(password);
  if (!comparePassword) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // let authHeaders = req.headers.authorization;

  // if(!authHeaders || !authHeaders.startsWith('Bearer ')){
  //     throw new UnauthenticatedError('Please provide the token!')
  // }
  // let token = authHeaders.split(' ')[1]
  // let auth = jwt.verify(token, process.env.JWT_SECRET_KEY )

  let token = result.Create_JWT();

  res.status(StatusCodes.OK)
      .json({
        success: true,
        user: { id: result._id, name: result.name, token: token },
    });
};

module.exports = {
  register,
  login,
};
