import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from './../validationSchema/authSchema';
import { validationSchema } from './../Middlewares/validationSchema';
import { authentication } from './../Middlewares/authentication';
import { userController } from './../Controllers/UserController';
//get User Details
router.get("/user-data", authentication, userController.getUserData);
router.get("/get-all-users",  userController.getAllUsers);

router.post(
  "/update-profile",
  authSchema.updateProfile,
  validationSchema,
  authentication,
  userController.updateProfile
);
router.post(
  "/change-password",
  authSchema.resetPasswordSchema,
  validationSchema,
  authentication,
  userController.changePassword
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
