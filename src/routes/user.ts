import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";
import UserController from "./../Controllers/UserController";

//get User Details
router.get("/", authentication, new UserController().getUserData);

router.get("/list", authentication, new UserController().listAllUsers);

router.get("/:id", authentication, new UserController().getUserById);

router.put(
  "/update-account-info",
  authentication,
  new UserController().updateAccountInfoById
);

router.post(
  "/request-verify-email",
  authSchema.emailSchema,
  validationSchema,
  authentication,
  new UserController().sendEmailVerify
);

router.post("/verify-email", authentication, new UserController().VerifyEmail);

router.post(
  "/change-password",
  authSchema.resetPasswordSchema,
  validationSchema,
  authentication,
  new UserController().changePassword
);

router.post(
  "/update-profile",
  authSchema.updateProfile,
  validationSchema,
  authentication,
  new UserController().updateProfile
);

router.post(
  "/update-phoneNumber",
  authSchema.updatephoneNumberSchema,
  validationSchema,
  authentication,
  new UserController().updatephoneNumber
);

//need to create update phone number api

export = router;
