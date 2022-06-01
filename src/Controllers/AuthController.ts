import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { mailServices } from './../Services/MailServices';
import { authServices } from './../Services/AuthServices';

export const authController = {
  login: async (request: any, response: any) => {
    try {
      await authServices.loginService(request.body).then((result: any) => {
        if (result.Count === 0) {
          response.status(200);
          response.send({
            success: false,
            message: "You’re login details are incorrect. Please try again!",
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

  signupRegistration: async (request: any, response: any) => {
    try {
      await authServices
        .signupCheckExistEmail(request.body)
        .then((res: any) => {
          if (res.Count > 0) {
            response.status(200);
            response.send({
              success: false,
              message: "An account already exists for this email address",
            });
          } else {
            authServices
              .signupRegistrationService(request.body)
              .then((result) => {
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
                authServices
                  .findIfCustomerIdExist(randomNumber)
                  .then((res) => {
                    // console.log('getting body data', request.body)
                    if (res.Count === 0) {
                      // console.log('getting response here need to add customer id', res)
                      authServices
                        .addCustomerId(request.body)
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
                      authServices
                        .addCustomerId(request.body)
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

  signupAccountInfo: async (request: any, response: any) => {
    try {
      await authServices.AccountInfoService(request.body).then((result) => {
        response.status(200);
        response.send({
          success: true,
          message: "Account information updated successfully",
          data: result.Attributes,
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
        await authServices
          .SignupOTPConfirmationService(request.body)
          .then((result) => {
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
          });
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
      await authServices
        .updateAmazonFlexInfoService(request.body)
        .then((result) => {
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
        });
    } catch (error) {
      response.status(301);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  },

  sendEmailVerify: async (request: any, response: any) => {
    try {
      var token = jwt.sign(
        { pk: request.body.pk, sk: request.body.sk },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "10m", // expires in 24 hours
        }
      );

      const emailData = {
        email: request.body.email,
        token: token,
      };
      //send email verifcation link
      mailServices.sendMailEmailVerification(emailData).then((res) => {
        response.status(200);
        response.send({
          success: true,
          message: "A Verification email sent successfully!",
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

  updateEmailVerify: async (request: any, response: any) => {
    try {
      await authServices
        .updateEmailVerifyService(request.body)
        .then((result) => {
          response.status(200);
          response.send({
            success: true,
            message: "Your email verified successfully!",
          });
        });
    } catch (error) {
      console.log("Oops something went wrong on email verification", error);
    }
  },

  forgotPassword: async (request: any, response: any) => {
    try {
      await authServices
        .forgotPasswordService(request.body)
        .then((result: any) => {
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
        });
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
      await authServices.setNewPasswordService(request.body).then((result) => {
        response.send({
          success: true,
          message: "Password Updated successfully!",
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

  verifyForgotToken: async (request: any, response: any) => {
    if (request.body.pk && request.body.sk) {
      response.send({
        success: true,
        message: "Token verified successfully!",
      });
    } else {
      response.send({
        success: false,
        message: "Invalid Token Failed to authenticate token",
      });
    }
  },
};
