
import bcrypt from 'bcryptjs'
import {authServices} from "../services/authServices";
import jwt from 'jsonwebtoken'
import { config } from '../utils/config';
import { mailServices } from '../services/mailServices';


export const authController = {
    login : async (request:any, response:any) => {

        try {
            await authServices.loginService(request.body).then((result:any)=>{

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
                                meta: null
                            })
                        }else{
                            response.status(200)
                            response.send({
                                status: false,
                                message: "You’re login details are incorrect. Please try again!",
                                data: [],
                                meta: null
                            })
                        }
                    })
                    .catch(error => {
                        response.status(200)
                        response.send({
                            status: false,
                            message: "You’re login details are incorrect. Please try again",
                            data: [],
                            meta: error
                        })
                    })
    
            })
            
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "You’re login details are incorrect. Please try again!",
                data: [],
                meta: error
            })
        }
    
      },
    
    
    signupRegistration : async (request:any, response:any) => {
        try {

            await authServices.signupCheckExistEmail(request.body).then((res:any) =>{
                if(res.Count > 0){
                    response.status(200)
                    response.send({
                        status: false,
                        message: "An account already exists for this email address",
                        data: [],
                        meta: null
                    }) 
                }else{
                     authServices.signupRegistrationService(request.body).then(result =>{
        
                        var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });

                       const emailData= {
                            email: request.body.email,
                            token: token,
                        }

                        mailServices.sendMailEmailVerification(emailData).then(res =>{
                            console.log('getting success mail', res)
                        })
                        .catch(error =>{
                            console.log('Ooops getting error on email send', error)
                        })
        
                        response.status(200)
                        response.send({
                            status: true,
                            message: 'User Registration Success!',
                            data: token,
                            meta: null
                        }) 
                    })
                }
            })

        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: 'Something went wrong while Registration!',
                data: [],
                meta: error
            }) 
        }
    },
    
    signupAccountInfo : async (request:any, response:any) => {
        try {
            await authServices.AccountInfoService(request.body).then(result => {
                response.status(200)
                response.send({
                    status: true,
                    message: 'Getting login data!',
                    data: result.Attributes,
                    meta: null
                }) 
            })
        } catch (error) {
            console.log('Oops something went wrong on signup account info', error)
            response.status(200)
                response.send({
                    status: true,
                    message: 'Someting went wrong on Account Info!',
                    meta: error
                }) 
        }
    },
    

    
    signupOTPConfirmation : async (request:any, response:any) => {
        try {
            if(request.body.otp === "1234"){
                await authServices.SignupOTPConfirmationService(request.body).then(result => {
                    // console.log('getting result response', result)
                    if(result){
                        response.status(200)
                        response.send({
                            status: true,
                            message: 'OTP verified successfully!',
                            data: [],
                            meta: null
                        })
                    }else{
                        response.status(200)
                        response.send({
                            status: false,
                            message: "Invalid OTP please try again",
                            data: [],
                            meta: null
                        })
                    }
                })
            }else{
                response.status(200)
                response.send({
                    status: false,
                    message: "Invalid OTP please try again",
                    data: [],
                    meta: null
                })
            }
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Someting went wrong on OTP verification!",
                data: [],
                meta: error
            })
        }
    },

    signupAmazonFlexInfo : async (request:any, response:any) => {
        try {
            await authServices.signupAmazonFlexInfoService(request.body).then(result =>{
                if(result){
                    response.status(200)
                    response.send({
                        status: true,
                        message: 'Amazon Flex info added successfully!',
                        data: result,
                        meta: null
                    })
                } else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: "We are unable to verify your email",
                        data: result,
                        meta: null
                    })
                }
            })
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Someting went wrong while email verification!",
                data: [],
                meta: error
            })
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
            await authServices.signupEmailVerifyService(request.body).then(result => {
                response.status(200)
                response.send({
                    status: true,
                    message: 'Your email verified successfully!',
                    data: [],
                    meta: null
                }) 
            })
        } catch (error) {
            console.log('Oops something went wrong on email verification', error)
        }
    },


    forgotPassword : async (request:any, response:any) => {
        try {
            await authServices.forgotPasswordService(request.body).then((result:any) => {

                if(result !== false){
                    var token = jwt.sign({ pk: (`u#${request.body.email}`), sk:(`login#${request.body.email}`) }, config.secret, {
                        expiresIn: '10m'
                    });

                    result["token"] = token;
    
                    try {
                         mailServices.sendMailForgotPassword(result).then((res)=>{
                            response.send({
                                status: true,
                                message: 'Email sent successfully!',
                                data: res,
                                meta: null
                            })
                        })
                        .catch(error => {
                            response.send({
                                status: false,
                                message: "We are unable to send mail!",
                                data: [],
                                meta: error
                            })
                        })
                    } catch (error) {
                        response.send({
                            status: false,
                            message: "Something went wrong while sending mail",
                            data: [],
                            meta: error
                        })
                    }

                }else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: "Invalid Email Address!",
                        data: [],
                        meta: null
                    })
                }
            })
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Oops something went wrong!",
                data: [],
                meta: error
            })
        }
    },


    forgotPasswordReset: async (request:any, response:any) => {

        try {
            await authServices.forgotPasswordResetService(request.body).then(result =>{
                response.send({
                    status: true,
                    message: 'Password Updated successfully!',
                    data: [],
                    meta: null
                })
            })
        } catch (error) {
            response.send({
                status: false,
                message: "Unable to update Password",
                data: [],
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
                meta: null
            })
        }else{
            response.send({
                status: false,
                message: "Invalid Token Failed to authenticate token",
                data: [],
                meta: null
            }) 
        }
    }

    
}

