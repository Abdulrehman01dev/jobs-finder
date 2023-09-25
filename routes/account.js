
const express = require('express');
const Router = express.Router();
const { register,login, forgotPassword, verifyResetPasswordToken, resetPassword } = require('../controllers/account');



Router.route('/register').post(register);
Router.route('/login').post(login);
Router.route('/forgot-password').post(forgotPassword);
Router.route('/verifyResetPasswordToken').post(verifyResetPasswordToken);
Router.route('/reset-password').post(resetPassword);


module.exports = Router