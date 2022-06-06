import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { ForgotController } from "./../Controllers/ForgotController";

// forgot password Api route
router.post(
  "/",
  authSchema.emailSchema,
  validationSchema,
  ForgotController.forgotPassword
);

router.post(
  "/verify-token",
  authSchema.verficationToken,
  validationSchema,
  ForgotController.verifyForgotToken
);

router.post(
  "/update-password",
  authSchema.passwordSchema,
  validationSchema,
  ForgotController.forgotPasswordReset
);

export = router;
