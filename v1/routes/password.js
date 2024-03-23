const { Router } = require("express");

// tokens
const { verifyToken } = require("../utils/tokens");

// validators
const { validate, forgotPasswordValidator, verifyOTPvalidator, resetPasswordValidator } = require("../utils/validators");

// controllers
const { forgotPassword, verifyOTP, resetPassword } = require("../controllers/passwordController");

const passwordRoute = Router();

passwordRoute.post("/forgot", validate(forgotPasswordValidator), forgotPassword);
passwordRoute.post("/verify-OTP", validate(verifyOTPvalidator), verifyOTP);
passwordRoute.post("/reset", validate(resetPasswordValidator), resetPassword);

module.exports = passwordRoute;
