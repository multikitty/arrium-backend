import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "./../Middlewares/authentication";

import PreferencesController from '../Controllers/PreferencesController';

// get user preference list
router.get("/", authentication, new PreferencesController().getPreferencesByUser);

router.post("/add", authentication, new PreferencesController().addPreferencesByUser);

export = router;
