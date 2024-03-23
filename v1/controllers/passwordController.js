const { generateRandomOTP } = require("../utils/generateRandomOTP");
const NodeCache = require("node-cache");
const { sendSMS } = require("../utils/sendSMS");
const User = require("../models/users");
const { hash, compare } = require("bcryptjs");
const handleCookieAndResponse = require("../utils/handleCookieAndResponse");

const cache = new NodeCache();

exports.forgotPassword = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        data: "User with phone number doesn't exist! 🙂",
      });
    }

    // Set the user id as the key for the OTP in the cache
    const otp = generateRandomOTP();
    cache.set(existingUser.id, otp.toString(), 600); // expires in 10 mins (600 seconds).

    const message = `The OTP you requested for is ${otp}. Note: It will expire in ten (10) minutes 🙂`;

    await sendSMS(res, phoneNumber, message);
  } catch (error) {
    // Handle errors
    console.error('Error processing forgot password:', error);
    res.status(500).json({
      success: false,
      data: 'Error processing forgot password. Please try again. 🙂',
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate request body
    if (!phoneNumber) {
      return res.status(400).json({
        success: true,
        data: "No phone number detected! It should be sent in the request body 🙂",
      });
    }

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: true,
        data: "User not found with the provided phone number",
      });
    }

    // Retrieve OTP from cache
    const cachedOTP = cache.take(user.id);

    // Validate OTP
    if (!cachedOTP || cachedOTP !== otp) {
      return res.status(400).json({
        success: true,
        data: "Invalid or expired OTP. Please regenerate OTP 🙂",
      });
    }

    // Update user's resetPasswordToken and resetPasswordExpire
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    res.status(200).json({
      success: true,
      message: "Please proceed to resetting your password.",
    });
  } catch (error) {
    // Handle errors
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      data: "Error processing verifying OTP. Please try again. 🙂",
    });
  }
};


exports.resetPassword = async (req, res, next) => {
  try {
    const { password, phoneNumber } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: "User not found with the provided phone number",
      });
    }

    // Validate reset token and expiration
    if (!user.resetPasswordToken || user.resetPasswordExpire <= Date.now()) {
      return res.status(400).json({
        success: false,
        data: "Reset token expired! Please try again later 🙂",
      });
    }

    // Update user's password and clear reset token
    const hashedPassword = await hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    // Set cookie and send response
    handleCookieAndResponse(res, user);
  } catch (error) {
    // Handle errors
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      data: "Error resetting password. Please try again. 🙂",
    });
  }
};
