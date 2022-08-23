import LocationController from "../Controllers/LocationController";
import express from "express";
import LocationValidation from "../validationSchema/locationValidation";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import { validationSchema } from "./../Middlewares/validationSchema";

// For Country
router.post("/country", authentication, new LocationValidation().country(), validationSchema,  new LocationController().addCountry);
router.delete("/country", authentication,  new LocationController().deleteCountry);
router.get("/country", authentication,  new LocationController().fetchAllCountry);
// For Regions
router.post("/region", authentication, new LocationValidation().region(), validationSchema,  new LocationController().addRegion);
router.delete("/region", authentication,  new LocationController().deleteRegion);
router.get("/region", authentication,  new LocationController().fetchAllRegion);

export = router;
