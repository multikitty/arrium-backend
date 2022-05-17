import express from "express"
const router = express.Router();
router.use(express.json())

import {authController} from '../controllers/authController'
import { authentication } from "../middlewares/authentication";

import AWS from "aws-sdk"
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
import  JsonWebTokenError  from "jsonwebtoken";
import { config } from "../utils/config";
let serviceConfigOptions : ServiceConfigurationOptions = {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT
};
const dynamoDB = new AWS.DynamoDB(serviceConfigOptions);


//Auth testing Api
router.get('/authTest', async (request, response) => {

    response.status(200)
    response.send({
        status: true,
        message: 'Hellow Auth api working fine!',
        data: [],
        error_code: false,
        error_msg: null,
        meta: null
    })
})



//Define here all routes related to Authentication
router.post('/login', authController.login)
router.post('/signup-registration', authController.signupRegistration)
router.post('/signup-account-info', authentication, authController.signupAccountInfo)
router.post('/signup-otp-confirmation', authentication, authController.signupOTPConfirmation)
router.post('/signup-amazon-flex-info', authentication, authController.signupAmazonFlexInfo)
router.post('/signup-verify-email', authentication, authController.signupEmailVerify)

router.post('/forgot-password', authController.forgotPassword)
router.post('/forgot-password-verify-token', authentication, authController.verifyForgotToken)
router.post('/forgot-password-reset', authentication, authController.forgotPasswordReset)
router.post('/mark-verify-email', authentication, authController.signupEmailVerify)


export = router