import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserServices from "../Services/UserServices";

export const SigninController = {
  login: async (request: any, response: any) => {
    try {
      await new UserServices().getUserIndexByEmail(request.body.email).then((result: any) => {
        if (result.Count === 0) {
          response.status(200);
          response.send({
            success: false,
            message: "Your login details are incorrect. Please try again!",
          });
        } else {
          let keyParams = {
            pk: result.Items[0]["sk"],
            sk: result.Items[0]["pk"], 
            user_role : result.Items[0]["role"]
          }
          // match password
          bcrypt
            .compare(request.body.password, result.Items[0].password)
            .then(async (authenticated) => {
              if (authenticated === true) {
                // create token
                let token = jwt.sign(
                  keyParams,
                  process.env.JWT_SECRET_KEY as string,
                  {
                    expiresIn: 86400, // expires in 24 hours
                  }
                );
                result.Items[0]["token"] = token;
                delete result.Items[0].password;
                console.log(result)
                response.status(200);
                response.send({
                  success: true,
                  message: "Getting login data!",
                  data: result.Items[0],
                });
              } else {
                response.status(200);
                response.send({
                  success: false,
                  message:
                    "Your login details are incorrect. Please try again!",
                });
              }
            })
            .catch((error) => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : error
              });
            });
        }
      });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });
    }
  },
};
