import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
// import ModelVersionsController from '../Controllers/ModelVersionsController';

router.post("/", authentication("admin"), new ModelVersionsController().addPhoneModel);
// router.post("/os-version/add", authentication("admin"), new ModelVersionsController().addOsVersion);
