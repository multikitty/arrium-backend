import LocationController from "../Controllers/LocationController";
import express from "express";
import LocationValidation from "../validationSchema/locationValidation";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import { validationSchema } from "./../Middlewares/validationSchema";

router.post("/country", authentication, new LocationValidation().country(), validationSchema,  new LocationController().addCountry);

export = router;
