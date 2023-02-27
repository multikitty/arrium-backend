const { body } = require('express-validator');

export const authSchema = {
  //Validation for Login
  loginSchema: [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must have at least one character lowercase')
      .matches(/[A-Z]/)
      .withMessage('Password must have at least one character uppercase')
      .matches(/\d/)
      .withMessage('Password must contain number characters'),
  ],

  //Validation for signup Registration
  signupRegistrationSchema: [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must have at least one character lowercase')
      .matches(/[A-Z]/)
      .withMessage('Password must have at least one character uppercase')
      .matches(/\d/)
      .withMessage('Password must contain number characters'),
    body('country').trim().toUpperCase().not().isEmpty().withMessage('Country Code is required.'),
  ],

  //validation for signup Account Information
  signupAccountInfoSchema: [
    body('firstname')
      .trim()
      .not()
      .isEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 40 })
      .withMessage('Please provide valid First name'),
    body('lastname')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Surname is required')
      .isLength({ min: 2, max: 40 })
      .withMessage('Please provide valid Surname'),
    body('phoneNumber')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 8, max: 13 })
      .withMessage('Please provide valid Phone number'),
    body('tzName')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Timezone is required')
      .isLength({ min: 4 })
      .withMessage('Please provide valid timezone'),
  ],

  //validation for signup OTP Confirmation
  otpConfirmationSchema: [
    body('otp')
      .trim()
      .not()
      .isEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 4, max: 4 })
      .withMessage('Please provide valid OTP'),
  ],

  updateAmazonFlexSchema: [
    body('amznFlexUser')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Amazon flex username is required'),
    body('amznFlexPassword')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Amazon flex password is required')
  ],

  emailSchema: [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please enter email address')
      .isEmail()
      .withMessage('Please enter a valid email address'),
  ],

  udpatePasswordSchema: [
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must have at least one character lowercase')
      .matches(/[A-Z]/)
      .withMessage('Password must have at least one character uppercase')
      .matches(/\d/)
      .withMessage('Password must contain number characters'),
    body('newPassword')
      .trim()
      .not()
      .isEmpty()
      .withMessage('New Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must have at least one character lowercase')
      .matches(/[A-Z]/)
      .withMessage('Password must have at least one character uppercase')
      .matches(/\d/)
      .withMessage('Password must contain number characters'),
    body('confirmPassword')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Confirm password is required')
      .custom((value: string, { req }: any) => {
        if (value !== req.body.newPassword) {
          throw new Error('Confirm Password does not match new password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ],

  updatephoneNumberSchema: [
    body('phoneNumber')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Phone number is required')
      .isLength({ min: 8, max: 13 })
      .withMessage('Please provide valid Phone number'),
    body('otp')
      .trim()
      .not()
      .isEmpty()
      .withMessage('OTP is required')
      .isLength({ min: 4, max: 4 })
      .withMessage('Please provide valid OTP'),
  ],

  updateProfile: [
    body('fieldName')
      .isIn(['firstname', 'lastname', 'tzName', 'amzCustomerId'])
      .withMessage('Field Name must be any of them firstname | lastname | tzName | amzCustomerId'),
    body('fieldValue').trim().not().isEmpty().withMessage('Please provide value'),
  ],

  verficationToken: [
    body('verficationToken')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Please provide Verfication Token')
      .isLength({ min: 100 })
      .withMessage('Please provide valid Verfication Token'),
  ],

  passwordSchema: [
    body('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches(/[a-z]/)
      .withMessage('Password must have at least one character lowercase')
      .matches(/[A-Z]/)
      .withMessage('Password must have at least one character uppercase')
      .matches(/\d/)
      .withMessage('Password must contain number characters'),
  ],
};
