import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "./../Middlewares/authentication";
import TimezoneController from "../Controllers/TimezoneController";

router.get("/list", authentication("all"), new TimezoneController().fetchTimezoneList);

router.get("/by-zone", authentication("all"), new TimezoneController().fetchTimezoneDetails);

export = router;