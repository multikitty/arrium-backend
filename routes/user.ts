import express from "express"
const router = express.Router();
router.use(express.json())

import { userController } from "../controllers/userController";
import { authentication } from "../middlewares/authentication";




//get User Details
router.get('/user-data', authentication, userController.getUserData)
router.get('/get-all-users', authentication, userController.getAllUsers)


export = router;