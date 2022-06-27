import fs from "fs";
import jwt from "jsonwebtoken";
import companyIds from "../Utils/customerId.json"
import MailServices from "../Services/MailServices";
import { SignupServices } from "../Services/SignupServices";
import UserServices from '../Services/UserServices';

export const SignupController = {
  // Signup Step 1
  signupRegistration: async (request: any, response: any) => {
    try {
      await new UserServices().getUserIndexByEmail(request.body.email).then(async (res: any) => {
        if (res.Count > 0) {
          response.status(200);
          response.send({
            success: false,
            message: "An account already exists for this email address",
          });
        } else {
          //For Generating customer Id
          let cIdObj = companyIds;
          cIdObj.lastCustomerId = cIdObj.lastCustomerId+1;
          fs.writeFile("src/Utils/customerId.json", JSON.stringify(cIdObj), (err) => {
            if (err) {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: err
              });
            } else {
              request.body.customerId = String(cIdObj.lastCustomerId);
              let userRole = "driver"
              // create sk, pk and role
              request.body.pk = `${request.body.countryCode ?? "UK"}-${request.body.customerId}`;
              request.body.sk = `${userRole}#${request.body.customerId}`;
              request.body.role = userRole;
              //  email verification token
              let token = jwt.sign(
                {
                  pk: request.body.pk,
                  sk: request.body.sk
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
                          message:"Something went wrong, please try after sometime.dfdsfsdfsd",
                          error : error
                        });
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
            };
          });
        }
      }).catch((error) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime. servi",
          error: error
        });
      });;
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
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
                message: "Incorrect OTP. Please try again, or go back to re-enter your number",
              });
            }
          }
        );
      } else {
        response.status(200);
        response.send({
          success: false,
          message: "Incorrect OTP. Please try again, or go back to re-enter your number",
        });
      }
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });
    }
  },

  updateAmazonFlexInfo: async (request: any, response: any) => {
    try {
      // AMZN Flex data
      let flexData = {
        pk : request.body.pk,
        sk : `flexDetails#${request.body.amznFlexUser}`,
        amznFlexUser : request.body.amznFlexUser,
        amznFlexPassword : request.body.amznFlexPassword
      }
      // update flex data
      await SignupServices.updateAmazonFlexInfoService(flexData).then(
        (result) => {
          if (result) {
            // Update account registration steps
            SignupServices.updateCurrentSteps(request.body)
            .then((result) => {
              response.status(200);
              response.send({
                success: true,
                message: "Amazon Flex info updated successfully.",
              });  
            }).catch((err) => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : err
              });
            });
          } else {
            response.status(500);
            response.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        }
      );
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
