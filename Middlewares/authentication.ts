import { config } from "../utils/config";
import jwt from 'jsonwebtoken'


export const authentication = (request:any, response:any, next:any) => {
    var token = request.headers['x-access-token'];

    if (!token) 
    return response.status(200).send({
            status: false,
            message: "No token Provided",
            data: [],
            meta: null
          })

    jwt.verify(token, config.secret, function(err:any, decoded:any) {
        if (err)
        return response.status(200).send({
          status: false,
          message: "Failed to authenticate token",
          data: [],
          meta: err
         });
        //  console.log('getting data', decoded)
        // if everything good, save to request for use in other routes
        request.body.pk = decoded.pk;
        request.body.sk = decoded.sk;
        next();
      });
}
