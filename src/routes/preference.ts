import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "./../Middlewares/authentication";

import PreferencesController from '../Controllers/PreferencesController';

// get user preference list
router.get("/", authentication("driver"), new PreferencesController().getPreferencesByUser);

router.post("/add", authentication("driver"), new PreferencesController().addPreferencesByUser);

router.post("/schedule", authentication("driver"), new PreferencesController().schedulePreferences);

router.get("/schedule", authentication("driver"), new PreferencesController().getAvailabilitySchedule);

export = router;
