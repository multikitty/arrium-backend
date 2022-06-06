import express from "express";
const router = express.Router();
router.use(express.json());
import { AuthController } from "./../Controllers/AuthController";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";

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
  AuthController.login
);
router.post(
  "/signup-registration",
  authSchema.signupRegistrationSchema,
  validationSchema,
  AuthController.signupRegistration
);
router.post(
  "/signup-account-info",
  authSchema.signupAccountInfoSchema,
  validationSchema,
  authentication,
  AuthController.signupAccountInfo
);
router.post(
  "/signup-otp-confirmation",
  authSchema.otpConfirmationSchema,
  validationSchema,
  authentication,
  AuthController.signupOTPConfirmation
);
router.post(
  "/update-amazon-flex-info",
  authSchema.updateAmazonFlexSchema,
  validationSchema,
  authentication,
  AuthController.updateAmazonFlexInfo
);
router.post(
  "/forgot-password",
  authSchema.emailSchema,
  validationSchema,
  AuthController.forgotPassword
);

router.post(
  "/forgot-password-verify-token",
  authentication,
  AuthController.verifyForgotToken
);
router.post(
  "/forgot-password-reset",
  authentication,
  AuthController.forgotPasswordReset
);

router.post(
  "/send-email-verify",
  authentication,
  AuthController.sendEmailVerify
);
router.post(
  "/update-verify-email",
  authentication,
  AuthController.updateEmailVerify
);

export = router;
