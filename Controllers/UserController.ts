import { userServices } from "../services/userServices"
import bcrypt from 'bcryptjs'
import { authServices } from "../services/authServices";


export const userController = {
    getUserData : async (request:any, response:any) =>{
       try {
            await userServices.getUserDataService(request.body).then(result =>{
                if(result.Item){
                    
                    delete result.Item.password;
                    delete result.Item.amznFlexPassword;

                    response.status(200)
                    response.send({
                        status: true,
                        message: 'User data retrived successfully!',
                        data: result.Item,
                        meta: null
                    })
                }
            })
       } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Something went wrong while getting users",
                data: [],
                meta: error
            })
       }
    },


    getAllUsers : async (request:any, response:any) => {
        try {
            await userServices.getAllUsersService(request.body).then((result:any) => {
               if(result.Items.length > 0) {
                    response.status(200)
                    response.send({
                        status: true,
                        message: 'User data retrived successfully!',
                        data: result.Items,
                        meta: null
                    })
               }else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: "No Customers Found",
                        data: [],
                        meta: null
                    })
               }
            })
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Something went wrong while gettting All Customers",
                data: [],
                meta: error
            })
        }
    },


    updateProfile : async (request: any, response: any) => {
        try {

            if(request.body.fieldName ==="email"){
                await userServices.updateEmailService(request.body).then(res =>{
                    response.status(200)
                    response.send({
                        status: true,
                        message: `${request.body.fieldName} updated successfully!`,
                        data: [],
                        meta: null
                    })
                })
            }

            await userServices.updateProfileService(request.body).then(res =>{
                response.status(200)
                response.send({
                    status: true,
                    message: `${request.body.fieldName} updated successfully!`,
                    data: [],
                    meta: null
                })
            })
        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Something went wrong while updating your profile",
                data: [],
                meta: error
            })
        }
    },

    changePassword: async (request: any, response: any) => {
        try {
            const dbPassword = await userServices.currentPasswordService(request.body)
            // console.log('getting current Password here', currentPassword?.Item?.password)

            bcrypt.compare(request.body.current_password, dbPassword?.Item?.password)
            .then(authenticated => {
                if(authenticated){
                    // console.log('Okay password is matching');
                    authServices.setNewPasswordService(request.body).then(() => {
                        response.status(200)
                        response.send({
                            status: false,
                            message: "New Password updated successfully!",
                            data: [],
                            meta: null
                        }) 
                    })
                }else{
                    response.status(200)
                    response.send({
                        status: false,
                        message: "The current password is incorrect. Please try again",
                        data: [],
                        meta: null
                    }) 
                }
            })

        } catch (error) {
            response.status(200)
            response.send({
                status: false,
                message: "Something went wrong while updating your password",
                data: [],
                meta: error
            }) 
        }
    },


    updatephoneNumber: async (request: any, response: any) => {
        if (request.body.otp === "1234") {
            try {
                await userServices.updatePhoneNumberService(request.body).then(res =>{
                    response.status(200)
                    response.send({
                        status: true,
                        message: 'Phone number updated successfully!',
                        data: [],
                        meta: null
                    })
                })
            } catch (error) {
                response.status(200)
                response.send({
                    status: false,
                    message: 'Something went wrong while updating phone number!',
                    data: [],
                    meta: error
                })
            }
        }else{
            response.status(200)
            response.send({
                status: false,
                message: "Incorrect OTP. Please try again, or go back to re-enter your number",
                data: [],
                meta: null
            })
        }
    }



}