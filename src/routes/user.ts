import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";
import userController from "./../Controllers/userController";

//get User Details
router.get("/", authentication, userController.getUserData);

router.get("/list", authentication, userController.listAllUsers);

router.get("/:id", authentication, userController.getUserById);

router.put(
  "/update-account-info",
  authentication,
  userController.updateAccountInfoById
);

router.post(
  "/request-verify-email",
  authSchema.emailSchema,
  validationSchema,
  authentication,
  userController.sendEmailVerify
);

router.post("/verify-email", authentication, userController.VerifyEmail);

router.post(
  "/change-password",
  authSchema.resetPasswordSchema,
  validationSchema,
  authentication,
  userController.changePassword
);

router.post(
  "/update-profile",
  authSchema.updateProfile,
  validationSchema,
  authentication,
  userController.updateProfile
);

router.post(
  "/update-phoneNumber",
  authSchema.updatephoneNumberSchema,
  validationSchema,
  authentication,
  userController.updatephoneNumber
);

//need to create update phone number api

export = router;
