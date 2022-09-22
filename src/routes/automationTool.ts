import express from "express";
const router = express.Router();
router.use(express.json());

import { automationToolAuth } from "../Middlewares/automationToolAuth";
import AutomationToolController from "../Controllers/AutomationToolController";


router.post("/flex-details-preferences", automationToolAuth, new AutomationToolController().fetchFlexAndPreferences);
// router.get("/station-type", authentication,  new LocationController().fetchAllStationType);
// router.delete("/station-type", authentication,  new LocationController().deleteStationType);

export = router;
