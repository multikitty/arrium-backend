import LocationController from "../Controllers/LocationController";
import express from "express";
import LocationValidation from "../validationSchema/locationValidation";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import { validationSchema } from "./../Middlewares/validationSchema";

// For Country
router.post("/country", authentication("admin"), new LocationValidation().country(), validationSchema,  new LocationController().addCountry);
router.delete("/country", authentication("admin"),  new LocationController().deleteCountry);
router.get("/country", authentication("admin"),  new LocationController().fetchAllCountry);
// For Regions
router.post("/region", authentication("admin"), new LocationValidation().region(), validationSchema,  new LocationController().addRegion);
router.delete("/region", authentication("admin"),  new LocationController().deleteRegion);
router.get("/region", authentication("admin"),  new LocationController().fetchAllRegion);
// For stations
router.post("/station", authentication("admin"), new LocationValidation().station(), validationSchema,  new LocationController().addStations);
router.get("/station", authentication("admin"),  new LocationController().fetchAllStation);
router.delete("/station", authentication("admin"),  new LocationController().deleteStation);

// For station types
router.post("/station-type", authentication("admin"), new LocationValidation().stationType(), validationSchema,  new LocationController().addStationType);
router.get("/station-type", authentication("admin"),  new LocationController().fetchAllStationType);
router.delete("/station-type", authentication("admin"),  new LocationController().deleteStationType);

export = router;
