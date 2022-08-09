import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import ModelVersionsController from '../Controllers/ModelVersionsController';
import CommonServices from "../Services/CommonServices";
// import CommonServices from "Services/CommonServices";


router.post("/phone-model/add", authentication, new ModelVersionsController().addPhoneModel);
router.post("/os-version/add", authentication, new ModelVersionsController().addOsVersion);

router.post("/flex-version/add", authentication, new ModelVersionsController().addFlexVersion);

router.get("/list", authentication, new ModelVersionsController().getModelVersionList);

router.delete("/delete", authentication, new CommonServices().deleteItem);

export = router;
