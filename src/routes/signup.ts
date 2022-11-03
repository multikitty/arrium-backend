import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";
import { SignupController } from "../Controllers/SignupController";

// signup Api route
router.post(
  "/registration",
  authSchema.signupRegistrationSchema,
  validationSchema,
  SignupController.signupRegistration
);

router.post(
  "/account-info",
  authentication("driver"),
  authSchema.signupAccountInfoSchema,
  validationSchema,
  SignupController.signupAccountInfo
);
router.post(
  "/otp-confirmation",
  authentication("driver"),
  authSchema.otpConfirmationSchema,
  validationSchema,
  SignupController.signupOTPConfirmation
);
router.post(
  "/update-amazon-flex-info",
  authentication("driver"),
  authSchema.updateAmazonFlexSchema,
  validationSchema,
  SignupController.updateAmazonFlexInfo
);

export = router;
