import { UserServices } from "../Services/UserServices"


export const UserController = {
    getUserData : async (request:any, response:any) =>{
       try {
        //    console.log('getting sk pk', request.body.sk, request.body.pk)
            await UserServices.getUserDataService(request.body).then(result =>{
                // console.log('hi getting response', result)
                if(result.Item){
                    
                    delete result.Item.password;
                    delete result.Item.amznFlexPassword;

                    response.status(200)
                    response.send({
                        status: true,
                        message: 'User data retrived successfully!',
                        data: result.Item,
                        error_code: false,
                        error_msg: null,
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
                error_msg: null,
                meta: error
            })
       }
    },


    getAllUsers : async (request:any, response:any) => {
        try {
            await UserServices.getAllUsersService(request.body).then(result => {
                console.log('getting all users', result)
            })
        } catch (error) {
            
        }
    }
}