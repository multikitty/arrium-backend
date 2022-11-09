import SesTemplatesController from "../Controllers/SesTemplatesController";
import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
// import ModelVersionsController from '../Controllers/ModelVersionsController';

router.post("/", new SesTemplatesController().createEmailTemplate);
// router.post("/os-version/add", authentication("admin"), new ModelVersionsController().addOsVersion);
export = router;