import { config } from "../Utils/config";
import jwt from 'jsonwebtoken'


export const auth = (request:any, response:any, next:any) => {
    var token = request.headers['x-access-token'];

    if (!token)
    return response.status(200).send({
            status: false,
            message: null,
            data: [],
            error_code: true,
            error_msg: "No token Provided",
            meta: null
          })

    jwt.verify(token, config.secret, function(err:any, decoded:any) {
        if (err)
        return response.status(200).send({
          status: false,
          message: null,
          data: [],
          error_code: true,
          error_msg: "Failed to authenticate token",
          meta: err
         });
        //  console.log('getting data', decoded)
        // if everything good, save to request for use in other routes
        request.body.pk = decoded.pk;
        request.body.sk = decoded.sk;
        next();
      });
}
