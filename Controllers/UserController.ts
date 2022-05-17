import { userServices } from "../services/userServices"


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
    }
}