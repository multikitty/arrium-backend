import jwt from "jsonwebtoken";
import { mailServices } from "./../Services/MailServices";
import { ForgotServices } from "./../Services/ForgotServices";

export const ForgotController = {
  forgotPassword: async (request: any, response: any) => {
    try {
      await ForgotServices.forgotPasswordService(request.body).then(
        (result: any) => {
          if (result !== false) {
            var token = jwt.sign(
              {
                pk: `u#${request.body.email}`,
                sk: `login#${request.body.email}`,
              },
              process.env.JWT_SECRET_KEY as string,
              {
                expiresIn: "5m",
              }
            );

            result["token"] = token;

            try {
              mailServices
                .sendMailForgotPassword(result)
                .then((res) => {
                  response.send({
                    success: true,
                    message: "Email sent successfully!",
                    // data: res,
                  });
                })
                .catch((error) => {
                  console.log("getting error while sending mail", error);
                  response.send({
                    success: false,
                    message: "We are unable to send mail!",
                  });
                });
            } catch (error) {
              response.send({
                success: false,
                message: "Something went wrong while sending mail",
              });
            }
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "email ID not found. Please check and try again!",
            });
          }
        }
      );
    } catch (error) {
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },

  forgotPasswordReset: async (request: any, response: any) => {
    try {
      jwt.verify(
        request.body.verficationToken,
        process.env.JWT_SECRET_KEY as string,
        function (err: any, decoded: any) {
          if (err) {
            return response.status(200).send({
              success: false,
              message: "Failed to authenticate token",
            });
          } else {
            // if everything good, save to request for use in other routes
            request.body.pk = decoded.pk;
            request.body.sk = decoded.sk;
          }
        }
      );
      await ForgotServices.setNewPasswordService(request.body).then(
        (result) => {
          response.send({
            success: true,
            message: "Password Updated successfully!",
          });
        }
      );
    } catch (error) {
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },

  verifyForgotToken: async (request: any, response: any) => {
    jwt.verify(
      request.body.verficationToken,
      process.env.JWT_SECRET_KEY as string,
      function (err: any, decoded: any) {
        if (err) {
          return response.status(200).send({
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
