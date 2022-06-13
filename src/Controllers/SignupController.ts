import jwt from "jsonwebtoken";
import MailServices from "../Services/MailServices";
import { SignupServices } from "./../Services/SignupServices";

export const SignupController = {
  // Signup Step 1
  signupRegistration: async (request: any, response: any) => {
    try {
      await SignupServices.signupCheckExistEmail(request.body).then(
        (res: any) => {
          if (res.Count > 0) {
            response.status(200);
            response.send({
              success: false,
              message: "An account already exists for this email address",
            });
          } else {
            //Generate Customer Id
            let exist: boolean = false;
            let customerId = "";
            do {
              customerId = "9" + (Math.floor(Math.random() * 90000) + 10000);
              SignupServices.findIfCustomerIdExist(customerId).then(
                (result) => {
                  if (result.Count === 0) {
                    request.body["randomNumber"] = String(customerId);
                    return (exist = false);
                  } else {
                    return (exist = true);
                  }
                }
              );
            } while (exist);

            //End Generate Customer Id

            //  email verification token
            let token = jwt.sign(
              {
                pk: `u#${request.body.email}`,
                sk: `login#${request.body.email}`,
                user_role: "driver",
              },
              process.env.JWT_SECRET_KEY as string,
              {
                expiresIn: 86400, // expires in 24 hours
              }
            );
            // email data
            const emailData = {
              email: request.body.email,
              token,
            };

            //send email verifcation link
            new MailServices()
              .sendMailEmailVerification(emailData)
              .then((mailResponse) => {
                if (mailResponse) {
                  SignupServices.signupRegistrationService(request.body)
                    .then(() => {
                      response.status(200);
                      response.send({
                        success: true,
                        message: "User Registration Success!",
                        data: { token },
                      });
                    })
                    .catch((error) => {
                      response.status(500);
                      response.send({
                        success: false,
                        message:
                          "Something went wrong, please try after sometime.",
                      });
                    });
                }
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
  // Signup Step 2
  signupAccountInfo: async (request: any, response: any) => {
    try {
      await SignupServices.AccountInfoService(request.body).then((result) => {
        response.status(200);
        response.send({
          success: true,
          message: "Account information updated successfully",
          // data: result.Attributes,
        });
      });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
      });
    }
  },
  // Signup Step 3
  signupOTPConfirmation: async (request: any, response: any) => {
    try {
      if (request.body.otp === "1234") {
        await SignupServices.SignupOTPConfirmationService(request.body).then(
          (result) => {
            if (result) {
              response.status(200);
              response.send({
                success: true,
                message: "OTP verified successfully!",
              });
            } else {
              response.status(200);
              response.send({
                success: false,
                message:
                  "Incorrect OTP. Please try again, or go back to re-enter your number",
              });
            }
          }
        );
      } else {
        response.status(200);
        response.send({
          success: false,
          message:
            "Incorrect OTP. Please try again, or go back to re-enter your number",
        });
      }
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
      });
    }
  },

  updateAmazonFlexInfo: async (request: any, response: any) => {
    try {
      await SignupServices.updateAmazonFlexInfoService(request.body).then(
        (result) => {
          if (result) {
            response.status(200);
            response.send({
              success: true,
              message: "Amazon Flex info added successfully!",
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "We are unable to verify your email",
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
};
