const { body, validationResult } = require("express-validator");

const validate = (validations) => {
  return async (req, res, next) => {
    try {
      // Ensure that validations is an array
      if (!Array.isArray(validations)) {
        throw new Error("Validations must be an array.");
      }

      // Execute each validation and collect the results
      const validationResults = await Promise.all(validations.map((validation) => validation.run(req)));

      // Check if any validation failed
      const errors = validationResults.reduce((acc, result) => {
        if (!result.isEmpty()) {
          return acc.concat(result.array());
        }
        return acc;
      }, []);

      // If there are errors, respond with a 422 status and error details
      if (errors.length > 0) {
        return res.status(422).json({ success: false, error: errors[0].msg });
      }

      // If validations pass, proceed to the next middleware
      return next();
    } catch (error) {
      // Handle unexpected errors
      console.error("Validation error:", error.message);
      return res.status(500).json({ success: false, error: "Please make sure you are sending the expected request body. Try again later! :)" });
    }
  };
};

const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password").trim().isLength({ min: 6 }).withMessage("Password should contain at least 6 characters!"),
];

const phoneNumberValidator = (value) => {
  if (!value.startsWith('+')) {
    throw new Error('Phone number must start with a + and include country code');
  }

  // Validating phone number length
  if (value.length < 10 || value.length > 15) {
    throw new Error('Invalid phone number length');
  }

  return true;
};

const bvnValidator = (value) => {
  if (value.length !== 11) {
    throw new Error('Invalid bvn');
  }

  return true;
}

const signupValidator = [
  body('country').trim(),
  body('bvn').trim().custom(bvnValidator),
  body('securityPin').trim(),
  body('name').notEmpty().withMessage('Name is required'),
  body('firstName').trim(),
  body('lastName').trim(),
  body('phoneNumber')
    .trim()
    .custom(phoneNumberValidator), // Use custom validation for phoneNumber
  ...loginValidator,
];

const forgotPasswordValidator = [
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage("Phone number can't be empty")
    .custom(phoneNumberValidator)
];

const verifyOTPvalidator = [
  body('otp')
  .trim()
  .notEmpty()
  .withMessage("otp can't be empty"),
  ...forgotPasswordValidator,
]

const resetPasswordValidator = [
  body("password").trim().notEmpty().withMessage("Password can't be empty!").isLength({ min: 6 }).withMessage("Password should contain at least 6 characters!"),
  ...forgotPasswordValidator,
]


module.exports = {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  verifyOTPvalidator,
  resetPasswordValidator,
  validate,
};
