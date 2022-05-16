import express from "express"
const router = express.Router();
router.use(express.json())

import { UserController } from "../Controllers/UserController";
import { auth } from "../Middlewares/auth";




//get User Details
router.get('/user-data', auth, UserController.getUserData)
router.get('/get-all-users', auth, UserController.getAllUsers)


export = router;