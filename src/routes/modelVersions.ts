import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import ModelVersionsController from '../Controllers/ModelVersionsController';

router.post("/phone-model/add", authentication("admin"), new ModelVersionsController().addPhoneModel);
router.post("/os-version/add", authentication("admin"), new ModelVersionsController().addOsVersion);

router.post("/flex-version/add", authentication("admin"), new ModelVersionsController().addFlexVersion);

router.get("/list", authentication("admin"), new ModelVersionsController().getModelVersionList);

router.delete("/delete", authentication("admin"), new ModelVersionsController().deleteModelVersion);

export = router;
