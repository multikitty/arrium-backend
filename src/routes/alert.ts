import express from "express";
const router = express.Router();
router.use(express.json());

import AlertController from "../Controllers/AlertController";
import { authentication } from "./../Middlewares/authentication";


//add blocks
router.post("/insertNotification", new AlertController().updateNotification);

export = router;
