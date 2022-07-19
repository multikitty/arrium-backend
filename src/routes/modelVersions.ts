import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import ModelVersionsController from '../Controllers/ModelVersionsController';


router.post("/phone-model/add", authentication, new ModelVersionsController().addPhoneModel);
router.post("/os-version/add", authentication, new ModelVersionsController().addOsVersion);

router.post("/flex-version/add", authentication, new ModelVersionsController().addFlexVersion);

router.get("/phone-model", authentication, new ModelVersionsController().getPhoneModelList);


export = router;
