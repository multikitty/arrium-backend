import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";
import UserController from "./../Controllers/UserController";
import FlexValidation from "../validationSchema/flexValidation";

//get User Details
router.get("/", authentication("driver"), new UserController().getUserData);

router.get("/list", authentication("admin"), new UserController().listAllUsers);
// get user by sk and pk for admin
router.get("/get", authentication("admin"), new UserController().getUserByPkSk);

router.get("/flex-details/:pk", authentication("admin"), new UserController().getAmznFlexDetails);

router.put("/flex-details/update", authentication("admin"), new UserController().updateAmznFlexDetails);

router.put("/update-account-info", authentication("admin"), new UserController().updateAccountInfo);

router.post("/approve-account", authentication("admin"), new UserController().sendAccountSetupMail);

router.post(
  "/request-verify-email",
  authentication("driver"),
  authSchema.emailSchema,
  validationSchema,
  new UserController().sendEmailVerify
);

router.post("/verify-email", authentication, new UserController().VerifyEmail);

router.post(
  "/update-password",
  authentication("driver"),
  authSchema.udpatePasswordSchema,
  validationSchema,
  new UserController().updatePassword
);

router.post(
  "/update-profile",
  authentication("driver"),
  authSchema.updateProfile,
  validationSchema,
  new UserController().updateProfileDetails
);

router.post(
  "/update-phoneNumber",
  authentication("driver"),
  authSchema.updatephoneNumberSchema,
  validationSchema,
  new UserController().updatephoneNumber
);


router.post(
  "/update-email",
  authentication("driver"),
  authSchema.emailSchema,
  validationSchema,
  new UserController().updateEmail
);

export = router;
