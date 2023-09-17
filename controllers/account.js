const { StatusCodes } = require("http-status-codes");
const users = require("../models/user");
const { UnauthenticatedError } = require("../errors");



const register = async (req, res) => {
  let result = await users.create({ ...req.body });

  let token = result.Create_JWT();

  res.status(StatusCodes.CREATED).json({
    success: true,
    user: { id: result._id, name: result.name, token: token, expiresIn: expirationTime() },
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

  let token = result.Create_JWT();

  res.status(StatusCodes.OK)
      .json({
        success: true,
        user: { id: result._id, name: result.name, token: token, expiresIn: expirationTime() },
    });
};



const expirationTime = () =>{
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const expirationTime = new Date().getTime() + oneDayInMilliseconds;
  return expirationTime;
}



module.exports = {
  register,
  login
};
