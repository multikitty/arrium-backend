import jwt from "jsonwebtoken";
import MailServices from "../Services/MailServices";
import { ForgotServices } from "../Services/ForgotServices";

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
             new MailServices()
                .sendMailForgotPassword(result)
                .then((res) => {
                  response.send({
                    success: true,
                    message: "Email sent successfully!",
                    // data: res,
                  });
                })
                .catch((error) => {
                  response.status(500);
                  response.send({
                    success: false,
                    message: "We are unable to send mail!",
                  });
                });
            } catch (error) {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong while sending mail",
              });
            }
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "Email ID not found. Please check and try again!",
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
