const { body } = require("express-validator");

export const authSchema = {
  //Validation for Login
  loginSchema: [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter email!")
      .isEmail()
      .withMessage("Please enter valid email!"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ],

  //Validation for signup Registration
  signupRegistrationSchema: [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter email!")
      .isEmail()
      .withMessage("Please enter valid email!"),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ],

  //validation for signup Account Information
  signupAccountInfoSchema: [
    body("firstname")
      .trim()
      .not()
      .isEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("Please provide valid First name"),
    body("lastname")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Surname is required")
      .isLength({ min: 2 })
      .withMessage("Please provide valid Surname"),
    body("phoneNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 8 })
      .withMessage("Please provide valid Phone number"),
    body("tzName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Timezone is required")
      .isLength({ min: 4 })
      .withMessage("Please provide valid timezone"),
  ],

  //validation for signup OTP Confirmation
  otpConfirmationSchema: [
    body("otp")
      .trim()
      .not()
      .isEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide valid OTP"),
  ],

  updateAmazonFlexSchema: [
    body("amznFlexUser")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Amazon flex username is required!")
      .isEmail()
      .withMessage("Please enter valid Amazon flex username!"),
    body("amznFlexPassword")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Amazon flex password is required")
      .isLength({ min: 8 })
      .withMessage("Amazon flex password must be at least 8 characters long."),
  ],

  emailSchema: [
    body("email")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please enter email!")
      .isEmail()
      .withMessage("Please enter valid email!"),
  ],

  resetPasswordSchema: [
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
    body("current_password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Current password is required")
      .isLength({ min: 8 })
      .withMessage("Current password must be at least 8 characters long."),
  ],

  updatephoneNumberSchema: [
    body("phoneNumber")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 8 })
      .withMessage("Please provide valid Phone number"),
    body("otp")
      .trim()
      .not()
      .isEmpty()
      .withMessage("OTP is required")
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide valid OTP"),
  ],
};
