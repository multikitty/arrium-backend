// import fs from 'fs';
import { promises as fs } from "fs";
import jwt from "jsonwebtoken";
import customerIds from "../Utils/customerId.json";
import MailServices from "../Services/MailServices";
import { SignupServices } from "../Services/SignupServices";
import UserServices from "../Services/UserServices";
import NotificationServices from "../Services/NotificationServices";
import ReferralServices from "../Services/ReferralServices";
import { AWSError } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { ZendeskUser } from "../Interfaces/zendeskInterface";
import ZendeskServices from "../Services/ZendeskServices";
import { EntitySkPk } from "../Interfaces/commonInterface";
import { Request, Response } from "express";
import { UpdateCurrentStepAndZendeskUsrID } from "Interfaces/userInterface";

export const SignupController = {
  // Signup Step 1
  signupRegistration: async (request: any, response: any) => {
    try {
      await new UserServices()
        .getUserIndexByEmail(request.body.email)
        .then(async (res: any) => {
          if (res.Count > 0) {
            response.status(200);
            response.send({
              success: false,
              message: "An account already exists for this email address",
            });
          } else {
            // referral code
            let refCode = "";
            // register flag
            let canSignup = false;
            // check referral code
            if (request.body.refCode) {
              // create referral code pattern
              refCode = request.body.country + "-" + request.body.refCode;
              // validate referral code is correct
              await new ReferralServices()
                .findReferralCode(refCode)
                .then(
                  (
                    result: PromiseResult<
                      DocumentClient.GetItemOutput,
                      AWSError
                    >
                  ) => {
                    if (result.Item) {
                      if (result.Item.refActive) {
                        canSignup = true;
                        request.body.customerId = String(refCode);
                      } else {
                        response.status(200);
                        response.send({
                          success: false,
                          message: "Referral code has been already used",
                        });
                      }
                    } else {
                      response.status(200);
                      response.send({
                        success: false,
                        message: "Invalid referral code.",
                      });
                    }
                  }
                )
                .catch((error) => {
                  response.status(500);
                  response.send({
                    success: false,
                    message:
                      "Something went wrong, please try after sometime. servi",
                    error: error,
                  });
                });
            } else {
              //For Generating customer Id
              await new UserServices()
                .generateRandomCustomerID(request.body.country)
                .then((cID) => {
                  if (cID) {
                    request.body.customerId = String(cID);
                    canSignup = true;
                  } else {
                    response.status(500);
                    response.send({
                      success: false,
                      message:
                        "Something went wrong, please try after sometime.",
                    });
                  }
                })
                .catch((err) => {
                  response.status(500);
                  response.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: err,
                  });
                });
            }
            // user signup
            if (canSignup) {
              // complete referral code
              request.body.fullRefCode = refCode;
              // user role
              let userRole = "driver";
              // create sk, pk and role
              request.body.pk = request.body.customerId;
              request.body.sk = `${userRole}#${request.body.customerId}`;
              request.body.role = userRole;
              //  email verification token
              let token = jwt.sign(
                {
                  pk: request.body.pk,
                  sk: request.body.sk,
                  userRole: request.body.role,
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
              await new MailServices()
                .sendMailEmailVerification(emailData)
                .then(async (mailResponse) => {
                  await SignupServices.signupRegistrationService(request.body)
                    .then(async () => {
                      if (request.body.refCode) {
                        let data = {
                          refCode: refCode,
                          status: false,
                        };
                        await new ReferralServices()
                          .udpateReferralCodeStatus(data)
                          .then(
                            (
                              result: PromiseResult<
                                DocumentClient.UpdateItemOutput,
                                AWSError
                              >
                            ) => {
                              response.status(200);
                              response.send({
                                success: true,
                                message: "User Registration Success!",
                                data: { token },
                              });
                            }
                          )
                          .catch((error) => {
                            response.status(500);
                            response.send({
                              success: false,
                              message:
                                "Something went wrong, please try after sometime.",
                              error: error,
                            });
                          });
                      } else {
                        response.status(200);
                        response.send({
                          success: true,
                          message: "User Registration Success!",
                          data: { token },
                        });
                      }
                    })
                    .catch((error) => {
                      response.status(500);
                      response.send({
                        success: false,
                        message:
                          "Something went wrong, please try after sometime.",
                        error: error,
                      });
                    });
                })
                .catch((error) => {
                  response.status(500);
                  response.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: error,
                  });
                });
            }
          }
        })
        .catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime. servi",
            error: error,
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  },
  // Signup Step 2
  signupAccountInfo: async (request: any, response: any) => {
    try {
      // generate otp
      request.body.otp = Math.floor(Math.random() * 9000 + 1000);
      let userPhone = request.body.dialCode + "" + request.body.phoneNumber;
      await SignupServices.AccountInfoService(request.body).then(
        async (result) => {
          await new NotificationServices()
            .sendOTPSMS({ otp: request.body.otp, userPhoneNumber: userPhone })
            .then(() => {
              response.status(200);
              response.send({
                success: true,
                message: "Account information updated successfully",
              });
            })
            .catch(() => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
              });
            });
        }
      );
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  },

  // Signup Step 3
  signupOTPConfirmation: async (request: any, response: any) => {
    try {
      // fetch user details
      await new UserServices()
        .getUserData(request.body)
        .then(async (result) => {
          if (result.Item) {
            if (Number(result.Item.otp) === Number(request.body.otp)) {
              await SignupServices.SignupOTPConfirmationService(request.body)
                .then((result) => {
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
                        "Something went wrong, please try after sometime.",
                    });
                  }
                })
                .catch((error) => {
                  response.status(500);
                  response.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: error,
                  });
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
        })
        .catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error,
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  },

  updateAmazonFlexInfo: async (request: Request, response: Response) => {
    try {
      // AMZN Flex data
      let flexData = {
        pk: request.body.pk,
        sk: `flexDetails#${request.body.pk}`,
        amznFlexUser: request.body.amznFlexUser,
        amznFlexPassword: request.body.amznFlexPassword,
      };
      // update flex data
      await SignupServices.updateAmazonFlexInfoService(flexData).then(
        async (result) => {
          if (result) {
            let keyParams: EntitySkPk = {
              sk: request.body.sk,
              pk: request.body.pk,
            };
            await new UserServices()
              .getUserData(keyParams)
              .then(
                async (
                  result: PromiseResult<DocumentClient.GetItemOutput, AWSError>
                ) => {
                  if (result.Item) {
                    // create a user in zendesk
                    let zendeskUser: ZendeskUser = {
                      email: result.Item.email,
                      name: result.Item.firstname + " " + result.Item.lastname,
                      role:
                        result.Item.role === "driver" ? "end-user" : "agent",
                      verified: true,
                      time_zone: result.Item.tzName,
                      organization_id: "8216223451037", // => default org id
                    };
                    await new ZendeskServices()
                      .createZendeskUser(zendeskUser)
                      .then(async (resp) => {
                        if (resp.status === 201 && resp?.data?.user?.id) {
                          // Update account registration steps
                          let updateParams: UpdateCurrentStepAndZendeskUsrID = {
                            sk: request.body.sk,
                            pk: request.body.pk,
                            currentStep: "holding",
                            zendeskUsrID: resp?.data?.user?.id,
                          };
                          await new UserServices()
                            .updateCurrentStepAndZendeskID(updateParams)
                            .then(async (result) => {
                              // send mail to admin here
                              let userData = {
                                email: result?.Attributes?.email,
                                firstname: result?.Attributes?.firstname,
                                lastname: result?.Attributes?.lastname,
                                role: result?.Attributes?.role,
                                status: result?.Attributes?.accountStatus,
                                timeZone: result?.Attributes?.tzName,
                              };
                              // send mail to queue
                              await new MailServices()
                                .newUserSignUpMail(userData)
                                .then(() => {
                                  response.status(200);
                                  response.send({
                                    success: true,
                                    message:
                                      "Amazon Flex info updated successfully.",
                                  });
                                })
                                .catch((err) => {
                                  response.status(500);
                                  response.send({
                                    success: false,
                                    message:
                                      "Something went wrong, please try after sometime.",
                                    error: err,
                                  });
                                });
                            })
                            .catch((err) => {
                              response.status(500);
                              response.send({
                                success: false,
                                message:
                                  "Something went wrong, please try after sometime.",
                                error: err,
                              });
                            });
                        } else {
                          response.status(500);
                          response.send({
                            success: false,
                            message:
                              "Something went wrong, please try after sometime.",
                          });
                        }
                      })
                      .catch((error: any) => {
                        response.status(200);
                        response.send({
                          success: false,
                          message:
                            error.response?.statusText ??
                            "Something went wrong, please try after sometime.",
                          error: error?.response?.data,
                          validationError: error?.response?.data,
                        });
                      });
                  } else {
                    response.status(500);
                    response.send({
                      success: false,
                      message:
                        "Something went wrong, please try after sometime.",
                    });
                  }
                }
              )
              .catch((err) => {
                response.status(500);
                response.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error: err,
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
        error: error,
      });
    }
  },
};
