const { Router } = require("express");

// validators
const {
    validate,
    signupValidator,
    loginValidator
} = require("../utils/validators");

// tokens
const {
    verifyToken
} = require("../utils/tokens");

// controllers
const {
    createUser,
    login,
    logout,
    getAllUsers
} = require("../controllers/userControllers");

const userRoute = Router();

// get all users
userRoute.get("/", getAllUsers);

// create a user
userRoute.post("/", validate(signupValidator), createUser);

// login
userRoute.post("/login", validate(loginValidator), login);

// logout
userRoute.get("/logout", verifyToken, logout);

module.exports = userRoute;