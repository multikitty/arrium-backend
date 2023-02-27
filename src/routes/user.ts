import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";
import UserController from "./../Controllers/UserController";
import FlexValidation from "../validationSchema/flexValidation";
import UserValidation from "../validationSchema/userValidation";

//get User Details
router.get("/", authentication("driver"), new UserController().getUserData);

router.post("/send-otp", authentication("driver"), new UserController().sendOtpToUser);

router.get("/list", authentication("admin"), new UserController().listAllUsers);
// get user by sk and pk for admin
router.get("/get", authentication("admin"), new UserController().getUserByPkSk);

router.get("/flex-details/:pk", authentication("admin"), new UserController().getAmznFlexDetails);

router.put("/flex-details/update", authentication("admin"), new FlexValidation().flexDetails(), validationSchema, new UserController().updateAmznFlexDetails);

router.put("/flex-details/update-tokens", authentication("admin"), new FlexValidation().flexTokens(), validationSchema, new UserController().updateFlexTokens);

router.put("/update-account-info", authentication("admin"), new UserController().updateAccountInfo);

router.post("/approve-account", authentication("admin"), new UserController().sendAccountSetupMail);

router.put("/pricing-plan", authentication("admin"), new UserController().enablePricingPlanPage);

router.get("/list-by-role", authentication("admin"), new UserController().fetchUserByRole);

router.post("/add-user", authentication("admin"), new UserValidation().addUser(), validationSchema, new UserController().addUser);

router.put("/update-flex-info", authentication("driver"), authSchema.updateAmazonFlexSchema, validationSchema, new UserController().updateFlexDetailsByDriver);

router.post(
  "/request-verify-email",
  authentication("driver"),
  authSchema.emailSchema,
  validationSchema,
  new UserController().sendEmailVerify
);

router.post("/verify-email", authentication("driver"), new UserController().VerifyEmail);

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
