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
  authSchema.signupAccountInfoSchema,
  validationSchema,
  authentication,
  SignupController.signupAccountInfo
);
router.post(
  "/otp-confirmation",
  authSchema.otpConfirmationSchema,
  validationSchema,
  authentication,
  SignupController.signupOTPConfirmation
);
router.post(
  "/update-amazon-flex-info",
  authSchema.updateAmazonFlexSchema,
  validationSchema,
  authentication,
  SignupController.updateAmazonFlexInfo
);

export = router;
