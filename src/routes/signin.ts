import { SigninController } from "./../Controllers/SigninController";
import express from "express";
const router = express.Router();
router.use(express.json());

import { authSchema } from "./../validationSchema/authSchema";
import { validationSchema } from "./../Middlewares/validationSchema";

// signin Api route
router.post(
  "/",
  authSchema.loginSchema,
  validationSchema,
  SigninController.login
);

export = router;
