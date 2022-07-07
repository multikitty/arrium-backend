import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "./../Middlewares/authentication";

import PreferencesController from '../Controllers/PreferencesController';

// get user preference list
router.get("/", authentication, new PreferencesController().getPreferencesByUser);
//get location list
router.get("/location", authentication, new PreferencesController().getLocationByUser);

export = router;
