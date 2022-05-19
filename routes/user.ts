import express from "express"
const router = express.Router();
router.use(express.json())

import { userController } from "../controllers/userController";
import { authentication } from "../middlewares/authentication";




//get User Details
router.get('/user-data', authentication, userController.getUserData)
router.get('/get-all-users', authentication, userController.getAllUsers)

router.post('/update-profile', authentication, userController.updateProfile)
router.post('/change-password', authentication, userController.changePassword)
router.post('/update-phoneNumber', authentication, userController.updatephoneNumber)

//need to create update phone number api


export = router;