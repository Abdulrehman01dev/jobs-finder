const { StatusCodes } = require("http-status-codes");
const users = require("../models/user");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');


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




const forgotPassword = async(req, res) =>{
  
const {email} = req.body;

if(!email){
  throw new BadRequestError('Please provide email address!')
}

const userInfo = await user.findOne({email: email});
if(userInfo){

  const secret = process.env.JWT_SECRET_KEY + userInfo.password;
  const token =  jwt.sign({email: userInfo.email, _id: userInfo._id}, secret, {expiresIn:'10m'})
  
  const siteUrl = process.env.siteUrl
  const link = `${siteUrl}/account/reset-password/${userInfo._id}/${token}`;
  const subject = "<jobs Finder> Reset your password!"
  
  const html = `
  <h1 style="color:#2FCA76;">Jobs Finder</h1>
  <h2 style="background:#2FCA76; color:#fff; padding:10px;">Reset your Jobs Finder password</h2>
  <div style="border: 1px solid #2FCA76; text-align:center; color:#000 !important;">
    <p>Jobs Finder password reset</p>
    <p>We heard that you lost your Jobs Finder password. Sorry about that!</p>
    <p>But don’t worry! You can use the following button to reset your password:</p>
    <a href=${link} style="background:#2fca76;color:#fff;padding:10px;margin:10px;display:inline-block">Reset your password</a>
    <p>If you don’t use this link within 10 minutes, it will expire. To get a new password reset link, visit: <a href="${siteUrl}/account/forgot-password">${siteUrl}/account/forgot-password</a></p>
    <p>Thanks,</p>
    <p>The Jobs Finder Team</p>
  </div>
  `
  
  try {
    await sendEmail(email, subject, html);
    res.json({ respones: "Forgot Password Email Sent" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("Internal Server error! Please try again later");
  }

}else{
  throw new BadRequestError('Invalid User Email!')
}
}




const verifyResetPasswordToken = async (req, res) => {
  const { _id, token } = req.body;
  console.log(_id, token);
  if (!_id || !token) {
    throw new BadRequestError("Please provide token and userId!");
  }

  const userInfo = await user.findOne({ _id: _id });

  if (!userInfo) {
    return res.send("User does not exsist!");
  }

  const secret = process.env.JWT_SECRET_KEY + userInfo.password;

  try {
    const verify = jwt.verify(token, secret);
    console.log(verify);
    return res.status(200).json({ status: "OK" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified!");
  }
};



const resetPassword = async (req, res) => {
  const { _id, token, password } = req.body;

  if (!_id || !token || !password) {
    throw new BadRequestError("Please provide token, userId or password !");
  }



  const userInfo = await user.findOne({ _id: _id });

  if (!userInfo) {
    return res.send("User does not exsist!");
  }

  const secret = process.env.JWT_SECRET_KEY + userInfo.password;

  try {
    const verify = jwt.verify(token, secret);  

    let salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);
    const updatePassword = await user.findOneAndUpdate({_id: verify._id}, {$set:{password: encryptPassword}});
    return res.json({ status: "Password Updated!" });
  } catch (error) {
    console.log(error);
    res.send("Something went wrong!");
  }
};




const expirationTime = () =>{
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const expirationTime = new Date().getTime() + oneDayInMilliseconds;
  return expirationTime;
}


const sendEmail = async(email, subject, html) =>{

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

 return await transporter.sendMail({
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: subject,
    html: html,
  });

}


module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword
};
