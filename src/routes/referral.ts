import express from "express";
import { validationSchema } from "../Middlewares/validationSchema";
import ReferralValidation from "../validationSchema/referralValidation";
const router = express.Router();
router.use(express.json());

import ReferralController from "../Controllers/ReferralController";
import { authentication } from "./../Middlewares/authentication";


router.post("/", authentication("admin"), new ReferralValidation().createReferral(), validationSchema, new ReferralController().createReferralCode);

export = router;