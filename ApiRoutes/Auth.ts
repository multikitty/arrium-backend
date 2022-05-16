import express from "express"
const router = express.Router();
router.use(express.json())

import {AuthController} from '../Controllers/AuthController'
import { auth } from "../Middlewares/auth";

import AWS from "aws-sdk"
import {ServiceConfigurationOptions} from 'aws-sdk/lib/service';
import  JsonWebTokenError  from "jsonwebtoken";
import { config } from "../Utils/config";
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
router.post('/login', AuthController.login)
router.post('/signup-registration', AuthController.signupRegistration)
router.post('/signup-account-info', auth, AuthController.signupAccountInfo)
router.post('/signup-otp-confirmation', auth, AuthController.signupOTPConfirmation)
router.post('/signup-amazon-flex-info', auth, AuthController.signupAmazonFlexInfo)
router.post('/signup-send-verify-email', auth, AuthController.signupSendMail)
router.post('/signup-verify-email', auth, AuthController.signupEmailVerify)

router.post('/forgot-password', AuthController.forgotPassword)
router.post('/forgot-password-verify-token', auth, AuthController.verifyForgotToken)
router.post('/forgot-password-reset', auth, AuthController.forgotPasswordReset)


export = router