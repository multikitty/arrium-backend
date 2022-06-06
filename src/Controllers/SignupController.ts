import jwt from "jsonwebtoken";
import { mailServices } from "./../Services/MailServices";
import { SignupServices } from "./../Services/SignupServices";

export const SignupController = {
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
            SignupServices.signupRegistrationService(request.body).then(
              (result) => {
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

                const emailData = {
                  email: request.body.email,
                  token: token,
                };
                //send email verifcation link
                mailServices
                  .sendMailEmailVerification(emailData)
                  .then((res) => {
                    // console.log('getting success mail', res)
                  })
                  .catch((error) => {
                    response.status(200);
                    response.send({
                      success: false,
                      message: "Something work with db. Try after sometime",
                    });
                  });

                //generate 6digit Customer ID
                let randomNumber =
                  "9" + (Math.floor(Math.random() * 90000) + 10000);
                request.body["randomNumber"] = randomNumber;
                SignupServices.findIfCustomerIdExist(randomNumber)
                  .then((res) => {
                    // console.log('getting body data', request.body)
                    if (res.Count === 0) {
                      // console.log('getting response here need to add customer id', res)
                      SignupServices.addCustomerId(request.body)
                        .then((res) => {
                          // console.log('getting response after add id', res)
                        })
                        .catch((err) => {
                          console.log("unable to add customer id", err);
                        });
                    } else {
                      let randomNumber =
                        "9" + (Math.floor(Math.random() * 90000) + 10000);
                      request.body["randomNumber"] = randomNumber;
                      SignupServices.addCustomerId(request.body)
                        .then((res) => {
                          // console.log('customer id added', res)
                        })
                        .catch((err) => {
                          console.log("unable to update customer ID", err);
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
                //generate customer ID end

                response.status(200);
                response.send({
                  success: true,
                  message: "User Registration Success!",
                  data: { token },
                });
              }
            );
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
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },

  signupOTPConfirmation: async (request: any, response: any) => {
    try {
      if (request.body.otp === "1234") {
        await SignupServices.SignupOTPConfirmationService(request.body).then(
          (result) => {
            // console.log('getting result response', result)
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
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
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
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },
};
