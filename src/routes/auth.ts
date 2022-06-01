import express from "express";
const router = express.Router();
router.use(express.json());
import { authController } from './../Controllers/AuthController';
import { validationSchema } from './../Middlewares/validationSchema';
import { authentication } from './../Middlewares/authentication';

import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import JsonWebTokenError from "jsonwebtoken";
import { authSchema } from "../validationSchema/authSchema";

let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
};
const dynamoDB = new AWS.DynamoDB(serviceConfigOptions);

//Auth testing Api
router.get("/authTest", async (request, response) => {
  response.status(200);
  response.send({
    status: true,
    message: "Hellow Auth api working fine!",
    data: [],
    error_code: false,
    error_msg: null,
    meta: null,
  });
});

//Define here all routes related to Authentication
router.post(
  "/login",
  authSchema.loginSchema,
  validationSchema,
  authController.login
);
router.post(
  "/signup-registration",
  authSchema.signupRegistrationSchema,
  validationSchema,
  authController.signupRegistration
);
router.post(
  "/signup-account-info",
  authSchema.signupAccountInfoSchema,
  validationSchema,
  authentication,
  authController.signupAccountInfo
);
router.post(
  "/signup-otp-confirmation",
  authSchema.otpConfirmationSchema,
  validationSchema,
  authentication,
  authController.signupOTPConfirmation
);
router.post(
  "/update-amazon-flex-info",
  authSchema.updateAmazonFlexSchema,
  validationSchema,
  authentication,
  authController.updateAmazonFlexInfo
);
router.post(
  "/forgot-password",
  authSchema.emailSchema,
  validationSchema,
  authController.forgotPassword
);

router.post(
  "/forgot-password-verify-token",
  authentication,
  authController.verifyForgotToken
);
router.post(
  "/forgot-password-reset",
  authentication,
  authController.forgotPasswordReset
);

router.post(
  "/send-email-verify",
  authentication,
  authController.sendEmailVerify
);
router.post(
  "/update-verify-email",
  authentication,
  authController.updateEmailVerify
);

export = router;
