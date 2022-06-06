import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SigninServices } from "./../Services/SigninServices";

export const SigninController = {
  login: async (request: any, response: any) => {
    try {
      await SigninServices.loginService(request.body).then((result: any) => {
        if (result.Count === 0) {
          response.status(200);
          response.send({
            success: false,
            message: "Your login details are incorrect. Please try again!",
          });
        } else {
          var token = jwt.sign(
            {
              pk: `u#${request.body.email}`,
              sk: `login#${request.body.email}`,
            },
            process.env.JWT_SECRET_KEY as string,
            {
              expiresIn: 86400, // expires in 24 hours
            }
          );

          result.Items[0]["token"] = token;

          bcrypt
            .compare(request.body.password, result.Items[0].password)
            .then((authenticated) => {
              if (authenticated === true) {
                delete result.Items[0].password;
                delete result.Items[0].amznFlexPassword;

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
                    "You’re login details are incorrect. Please try again!",
                });
              }
            })
            .catch((error) => {
              response.status(301);
              response.send({
                success: false,
                message: "Something work with db. Try after sometime",
              });
            });
        }
      });
    } catch (error) {
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },
};
