import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "../Middlewares/authentication";
import ModelVersionsController from '../Controllers/ModelVersionsController';


router.post("/phone-model/add", authentication, new ModelVersionsController().addPhoneModel);

export = router;
