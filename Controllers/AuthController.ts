
import bcrypt from 'bcryptjs'
import {AuthServices} from "../Services/AuthServices";
import jwt from 'jsonwebtoken'
import { config } from '../Utils/config';
import { MailServices } from '../Services/MailServices';


export const AuthController = {
    login : async (request:any, response:any) => {

        try {
            await AuthServices.loginService(request.body).then((result:any)=>{

                var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
    
                result.Items[0]["token"] = token;
    
                bcrypt.compare(request.body.password, result.Items[0].password)
                    .then(authenticated => {
                        if(authenticated === true){
                            response.status(200)
                            response.send({
                                status: true,
                                message: 'Getting login data!',
                                data: result.Items[0],
                                error_code: false,
                                error_msg: null,
                                meta: null
                            })
                        }else{
                            response.status(200)
                            response.send({
                                status: false,
                                message: null,
                                data: [],
                                error_code: true,
                                error_msg: "You’re login details are incorrect. Please try again!",
                                meta: null
                            })
                        }
                    })
                    .catch(error => {
                        response.status(200)
                        response.send({
                            status: false,
                            message: null,
                            data: [],
                            error_code: true,
                            error_msg: "You’re login details are incorrect. Please try again",
                            meta: error
                        })
                    })
    
            })
            
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: null,
                data: [],
                error_code: true,
                error_msg: "You’re login details are incorrect. Please try again!",
                meta: error
            })
        }
    
      },
    
    
    signupRegistration : async (request:any, response:any) => {
        try {
            await AuthServices.signupRegistrationService(request.body).then(result =>{

                var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                response.status(200)
                response.send({
                    status: true,
                    message: 'User Registration Success!',
                    data: token,
                    error_code: false,
                    error_msg: null,
                    meta: null
                }) 
            })
        } catch (error) {
            console.log('signup registration error', error)
        }
    },
    
    signupAccountInfo : async (request:any, response:any) => {
        try {
            await AuthServices.AccountInfoService(request.body).then(result => {
                response.status(200)
                response.send({
                    status: true,
                    message: 'Getting login data!',
                    data: result.Attributes,
                    error_code: false,
                    error_msg: null,
                    meta: null
                }) 
            })
        } catch (error) {
            console.log('Oops something went wrong on signup account info', error)
        }
    },
    
    
    signupOTPConfirmation : async (request:any, response:any) => {
        try {
            await AuthServices.SignupOTPConfirmationService(request.body).then(result => {
                // console.log('getting result response', result)
                if(result){
                    response.status(200)
                    response.send({
                        status: true,
                        message: 'OTP verified successfully!',
                        data: [],
                        error_code: false,
                        error_msg: null,
                        meta: null
                    })
                }else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: null,
                        data: result,
                        error_code: true,
                        error_msg: "Invalid OTP please try again",
                        meta: null
                    })
                }
            })
        } catch (error) {
            console.log('Oops something went wrong on otp confirmation', error)
        }
    },

    signupAmazonFlexInfo : async (request:any, response:any) => {
        try {
            await AuthServices.signupAmazonFlexInfoService(request.body).then(result =>{
                if(result){
                    response.status(200)
                    response.send({
                        status: true,
                        message: 'Amazon Flex info added successfully!',
                        data: result,
                        error_code: false,
                        error_msg: null,
                        meta: null
                    })
                } else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: null,
                        data: result,
                        error_code: true,
                        error_msg: "We are unable to verify your email",
                        meta: null
                    })
                }
            })
        } catch (error) {
            console.log('Oops something went wrong on adding amazon flex info', error)
        }
    },

    signupSendMail: async (request:any, response:any) => {
        try {
            await AuthServices.signupSendMailService(request.body).then((result:any) => {

                var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                result.Item["token"] = token;

                if(result.Item){
                    // MailServices.sendMailSignupVerifyEmail(result.Item).then(res => {
                        response.send({
                            status: true,
                            message: 'Email sent successfully!',
                            data: [],
                            error_code: false,
                            error_msg: null,
                            meta: null
                        })
                    // })
                }
            })
        } catch (error) {
            console.log('error at sending mail', error)
        }
    },

    signupEmailVerify : async (request:any, response:any) => {
        try {
            // const token = request.query.token
            // jwt.verify(token, config.secret, function(err:any, decoded:any) {
            //     if (err)
            //     return response.status(200).send({
            //         status: false,
            //         message: null,
            //         data: [],
            //         error_code: true,
            //         error_msg: "Failed to authenticate token",
            //         meta: err
            //        });
            //     request.body.pk = decoded.pk;
            //     request.body.sk = decoded.sk;
            // })
            await AuthServices.signupEmailVerifyService(request.body).then(result => {
                response.status(200)
                response.send({
                    status: true,
                    message: 'Your email verified successfully!',
                    data: [],
                    error_code: false,
                    error_msg: null,
                    meta: null
                }) 
            })
        } catch (error) {
            console.log('Oops something went wrong on email verification', error)
        }
    },


    forgotPassword : async (request:any, response:any) => {
        try {
            await AuthServices.forgotPasswordService(request.body).then((result:any) => {

                if(result !== false){
                    var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                        expiresIn: '10m'
                    });

                    result["token"] = token;
    
                    try {
                         MailServices.sendMailForgotPassword(result).then((res)=>{
                            response.send({
                                status: true,
                                message: 'Email sent successfully!',
                                data: res,
                                error_code: false,
                                error_msg: null,
                                meta: null
                            })
                        })
                        .catch(error => {
                            response.send({
                                status: true,
                                message: null,
                                data: [],
                                error_code: true,
                                error_msg: "We are unable to send mail!",
                                meta: error
                            })
                        })
                    } catch (error) {
                        response.send({
                            status: false,
                            message: null,
                            data: [],
                            error_code: true,
                            error_msg: "Something went wrong while sending mail",
                            meta: error
                        })
                    }

                }else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: null,
                        data: [],
                        error_code: true,
                        error_msg: "Invalid Email Address!",
                        meta: null
                    })
                }
            })
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: null,
                data: [],
                error_code: true,
                error_msg: "Oops something went wrong!",
                meta: error
            })
        }
    },


    forgotPasswordReset: async (request:any, response:any) => {

        try {
            await AuthServices.forgotPasswordResetService(request.body).then(result =>{
                response.send({
                    status: true,
                    message: 'Password Updated successfully!',
                    data: [],
                    error_code: false,
                    error_msg: null,
                    meta: null
                })
            })
        } catch (error) {
            response.send({
                status: false,
                message: null,
                data: [],
                error_code: true,
                error_msg: "Unable to update Password",
                meta: error
            })
        }
    },


    verifyForgotToken: async (request:any, response:any) => {
        if(request.body.pk && request.body.sk){
            response.send({
                status: true,
                message: 'Token verified successfully!',
                data: [],
                error_code: false,
                error_msg: null,
                meta: null
            })
        }else{
            response.send({
                status: false,
                message: null,
                data: [],
                error_code: true,
                error_msg: "Invalid Token Failed to authenticate token",
                meta: null
            }) 
        }
    }

    
}

