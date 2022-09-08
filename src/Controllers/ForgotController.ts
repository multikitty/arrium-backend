import jwt from "jsonwebtoken";
import MailServices from "../Services/MailServices";
import { ForgotServices } from "../Services/ForgotServices";
import UserServices from "../Services/UserServices";

export const ForgotController = {
  // forgot password
  forgotPassword: async (request: any, response: any) => {
    try {
      await new UserServices().getUserIndexByEmail(request.body.email).then((result: any) => {
        if (result.Count === 0) {
          response.status(200);
          response.send({
            success: false,
            message: "Email ID not found. Please check and try again!",
          });
        } else {
          let keyParams = {
            pk: result.Items[0]["pk"],
            sk: result.Items[0]["sk"], 
            userRole : result.Items[0]["role"]
          }
          // create token
          let token = jwt.sign(
            keyParams,
            process.env.JWT_SECRET_KEY as string,
            {
              expiresIn: "30m",
            }
          );
          result.Items[0]["token"] = token;
          // send mail
          new MailServices()
            .sendMailForgotPassword(result.Items[0])
            .then((res) => {
              response.send({
                success: true,
                message: "Password reset link sent, please check your email!",
              });
            })
            .catch((error) => {
              response.status(500);
              response.send({
                success: false,
                message: "We are unable to send mail!",
                error : error
              });
            });
        }
      }).catch((error) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error : error
        });
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
  // update password
  forgotPasswordReset: async (request: any, response: any) => {
    try {
      jwt.verify(
        request.body.verficationToken,
        process.env.JWT_SECRET_KEY as string,
        function (err: any, decoded: any) {
          if (err) {
            return response.status(401).send({
              success: false,
              message: "Failed to authenticate token",
            });
          } else {
            // if everything good, save to request for use in other routes
            request.body.pk = decoded.pk;
            request.body.sk = decoded.sk;
            request.body.role = decoded.userRole;
            // update new password
            ForgotServices.setNewPasswordService(request.body)
              .then((result) => {
                response.send({
                  success: true,
                  message: "Password Updated successfully!",
                });
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
        }
      );
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
      });
    }
  },
  // verify token
  verifyForgotToken: async (request: any, response: any) => {
    jwt.verify(
      request.body.verficationToken,
      process.env.JWT_SECRET_KEY as string,
      function (err: any, decoded: any) {
        if (err) {
          return response.status(401).send({
            success: false,
            message: "Failed to authenticate token",
          });
        } else {
          response.send({
            success: true,
            message: "Token verified successfully!",
          });
        }
      }
    );
  },

};
