import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import MailServices from "../Services/MailServices";
import UserServices from "../Services/UserServices";
import { Request, Response } from "express";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import {
  AddUserObj,
  UpdateCurrentStep,
  UpdatePricingPlanObj,
} from "../Interfaces/userInterface";
import fs from "fs";
import companyIds from "../Utils/customerId.json";
import { ZendeskUpdateUser } from "../Interfaces/zendeskInterface";
import ZendeskServices from "../Services/ZendeskServices";
import StripeServices from "../Services/StripeServices";
import NotificationServices from "../Services/NotificationServices";
import { SignupServices } from "Services/SignupServices";

export default class UserController {
  // get logged in user data
  async getUserData(request: any, response: any) {
    try {
      await new UserServices()
        .getUserData(request.body)
        .then((result) => {
          if (result.Item) {
            delete result.Item.password;
            response.status(200);
            response.send({
              success: true,
              message: "User data retrived successfully",
              data: result.Item,
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
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }
  // get amzn flex details
  async getAmznFlexDetails(request: any, response: any) {
    try {
      await new UserServices()
        .fetchAmznFlexDetails(request.params)
        .then((result: any) => {
          if (result.Item) {
            response.status(200);
            response.send({
              success: true,
              message: "Flex details retrieved successfully",
              data: result.Item,
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "Flex details are empty.",
              data: result.Item,
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
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }
  /**
   * updateAmznFlexDetails
   */
  public async updateAmznFlexDetails(request: Request, response: Response) {
    // update zendesk organisation id of user
    let zendeskParams: ZendeskUpdateUser = {
      zendeskUserId: request.body.zendeskUserID,
      organization_id: request.body.zendeskOrgID,
    };
    // update zendesk organization
    await new ZendeskServices()
      .updateZendeskUser(zendeskParams)
      .then(async (resp: any) => {
        if (resp.status === 200) {
          await new UserServices()
            .updateFlexDetails(request.body)
            .then(async (result: any) => {
              // handle result
              if (result.Attributes) {
                const responseData = result.Attributes;
                // udpate changes in user entity
                let countryRegionData = {
                  userPk: request.body.userPk,
                  userSk: request.body.userSk,
                  country: result.Attributes.country,
                  region: result.Attributes.regionCode,
                };
                await new UserServices()
                  .updateUserCountryRegion(countryRegionData)
                  .then((result) => {
                    if (result) {
                      response.status(200);
                      response.send({
                        success: true,
                        message: "Configuration details updated successfully.",
                        data: responseData,
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
                    response.status(500);
                    response.send({
                      success: false,
                      message:
                        "Something went wrong, please try after sometime.",
                      error: error,
                    });
                  });
              } else {
                response.status(500);
                response.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                });
              }
            })
            .catch((error: any) => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: error,
              });
            });
        } else {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
          });
        }
      })
      .catch((error: any) => {
        response.status(error.response?.status ?? 500);
        response.send({
          success: false,
          message:
            error.response?.statusText ??
            "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }
  // get single user data
  async getUserByPkSk(request: any, response: any) {
    try {
      await new UserServices()
        .getUserData(request.query)
        .then((result: any) => {
          if (result.Item) {
            delete result.Item.password;
            response.status(200);
            response.send({
              success: true,
              message: "Customer data retrieved successfully",
              data: result.Item,
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "No data found",
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
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }
  // update account info
  async updateAccountInfo(request: any, response: any) {
    try {
      // update zendesk organisation id of user
      let zendeskParams: ZendeskUpdateUser = {
        zendeskUserId: request.body.zendeskUserID,
        name: request.body.firstname + " " + request.body.lastname,
        email: request.body.email,
        time_zone: request.body.tzName,
      };
      // update zendesk organization
      await new ZendeskServices()
        .updateZendeskUser(zendeskParams)
        .then(async (resp: any) => {
          if (resp.status === 200) {
            await new UserServices()
              .updateAccountInfo(request.body)
              .then((result) => {
                if (result.Attributes) {
                  // update user name and email in stripe
                  if (
                    result.Attributes.role === "driver" &&
                    result.Attributes.stripeID
                  ) {
                    let stripeParams = {
                      stripeId: result.Attributes.stripeID,
                      name:
                        result.Attributes.firstname +
                        " " +
                        result.Attributes.lastname,
                      email: result.Attributes.email,
                    };
                    new StripeServices()
                      .updateCustomer(stripeParams)
                      .then((resp) => {
                        response.status(200);
                        response.send({
                          success: true,
                          message:
                            "User Account Information updated successfully",
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
                    response.status(200);
                    response.send({
                      success: true,
                      message: "User Account Information updated successfully",
                    });
                  }
                } else {
                  response.status(500);
                  response.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
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
            response.status(500);
            response.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        })
        .catch((error: any) => {
          response.status(error.response?.status ?? 500);
          response.send({
            success: false,
            message:
              error.response?.statusText ??
              "Something went wrong, please try after sometime.",
            error: error?.response?.data,
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
  }
  // fetch user list
  async listAllUsers(request: any, response: any) {
    try {
      await new UserServices()
        .getAllUsers(request.query)
        .then((result: any) => {
          response.status(200);
          response.send({
            success: true,
            message: "User data retrieved successfully.",
            data: result,
          });
        })
        .catch((err) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: err,
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
  }
  // send email verification email
  async sendEmailVerify(request: any, response: any) {
    try {
      let token = jwt.sign(
        {
          pk: request.body.pk,
          sk: request.body.sk,
          userRole: request.body.role,
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "15m", // expires in 15 minutes
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
        .then((res) => {
          response.status(200);
          response.send({
            success: true,
            message: "Verification email sent successfully",
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
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }
  // verify email
  async VerifyEmail(request: any, response: any) {
    try {
      jwt.verify(
        request.body.verficationToken,
        process.env.JWT_SECRET_KEY as string,
        async function (err: any, decoded: any) {
          if (err) {
            return response.status(200).send({
              success: false,
              message: "Verfication Failed!",
            });
          } else {
            await new UserServices()
              .updateEmailVerify(decoded)
              .then((result) => {
                response.status(200);
                response.send({
                  success: true,
                  message: "Your email verified successfully",
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
      );
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error,
      });
    }
  }

  async updateProfileDetails(req: Request, res: Response) {
    try {
      await new UserServices()
        .updateProfile(req.body)
        .then(
          async (
            result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>
          ) => {
            if (result.Attributes) {
              // update details in Zendesk
              let zendeskParams: ZendeskUpdateUser = {
                name:
                  result.Attributes?.firstname +
                  " " +
                  result.Attributes?.lastname,
                zendeskUserId: result.Attributes?.zendeskUserID,
                time_zone: result.Attributes?.tzName,
              };

              // update user name and email in stripe
              if (
                result.Attributes.role === "driver" &&
                result.Attributes.stripeID
              ) {
                let stripeParams = {
                  stripeId: result.Attributes.stripeID,
                  name:
                    result.Attributes.firstname +
                    " " +
                    result.Attributes.lastname,
                  email: result.Attributes.email,
                };
                await new StripeServices().updateCustomer(stripeParams);
              }
              // update zendesk
              await new ZendeskServices()
                .updateZendeskUser(zendeskParams)
                .then(async (resp: any) => {
                  if (resp.status === 200) {
                    res.status(200);
                    res.send({
                      success: true,
                      message: `Updated successfully`,
                      data: result,
                    });
                  } else {
                    res.status(500);
                    res.send({
                      success: false,
                      message:
                        "Something went wrong, please try after sometime.",
                    });
                  }
                })
                .catch((error: any) => {
                  res.status(error.response?.status ?? 500);
                  res.send({
                    success: false,
                    message:
                      error.response?.statusText ??
                      "Something went wrong, please try after sometime.",
                    error: error?.response?.data,
                  });
                });
            } else {
              res.status(500);
              res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
              });
            }
          }
        )
        .catch((err) => {
          res.status(500);
          res.send({
            success: false,
            message: "Something went wrong while updating your profile data.",
            error: err,
          });
        });
    } catch (err) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong while updating your profile data.",
        error: err,
      });
    }
  }

  async updatePassword(request: any, response: any) {
    try {
      const result: any = await new UserServices().getUserCurrentPassword(
        request.body
      );
      bcrypt
        .compare(request.body.password, result?.Item?.password)
        .then((authenticated) => {
          if (authenticated) {
            new UserServices()
              .setNewPassword(request.body)
              .then((result) => {
                response.status(200);
                response.send({
                  success: true,
                  message: "New Password updated successfully",
                });
              })
              .catch((error) => {
                response.status(500);
                response.send({
                  success: false,
                  message:
                    "Something went wrong, Please try again after sometime.",
                  error: error,
                });
              });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "The current password is incorrect. Please try again!",
            });
          }
        })
        .catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, Please try again after sometime.",
            error: error,
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while updating your password",
        error: error,
      });
    }
  }

  /**
   * Update email
   */
  public async updateEmail(req: Request, res: Response) {
    await new UserServices()
      .updateEmail(req.body)
      .then(
        async (
          result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>
        ) => {
          if (result.Attributes) {
            // update user name and email in stripe
            if (
              result.Attributes.role === "driver" &&
              result.Attributes.stripeID
            ) {
              let stripeParams = {
                stripeId: result.Attributes.stripeID,
                name:
                  result.Attributes.firstname +
                  " " +
                  result.Attributes.lastname,
                email: result.Attributes.email,
              };
              await new StripeServices().updateCustomer(stripeParams);
            }
            //  email verification token
            let token = jwt.sign(
              {
                pk: req.body.pk,
                sk: req.body.sk,
                userRole: req.body.role,
              },
              process.env.JWT_SECRET_KEY as string,
              {
                expiresIn: 86400, // expires in 24 hours
              }
            );
            // email data
            const emailData = {
              email: req.body.email,
              token,
            };
            //send email verifcation link
            await new MailServices()
              .sendMailEmailVerification(emailData)
              .then(async (mailResponse) => {
                // update details in Zendesk
                let zendeskParams: ZendeskUpdateUser = {
                  zendeskUserId: result.Attributes?.zendeskUserID,
                  email: result.Attributes?.email,
                };
                // update zendesk
                await new ZendeskServices()
                  .updateZendeskUser(zendeskParams)
                  .then(async (resp: any) => {
                    if (resp.status === 200) {
                      res.status(200);
                      res.send({
                        success: true,
                        message:
                          "Email updated successfully, please check verification mail.",
                      });
                    } else {
                      res.status(500);
                      res.send({
                        success: false,
                        message:
                          "Something went wrong, please try after sometime.",
                      });
                    }
                  })
                  .catch((error: any) => {
                    res.status(error.response?.status ?? 500);
                    res.send({
                      success: false,
                      message:
                        error.response?.statusText ??
                        "Something went wrong, please try after sometime.",
                      error: error?.response?.data,
                    });
                  });
              })
              .catch((error: any) => {
                res.status(500);
                res.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error: error,
                });
              });
          } else {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        }
      )
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  /**
   * Update Phone Number
   */
  public async updatePhoneNumber(req: Request, res: Response) {
    req.body.otp = Math.floor(Math.random() * 9000 + 1000);
    let userPhone = req.body.dialCode + "" + req.body.phoneNumber;
    await new UserServices()
      .changePhoneNumberPhoneNumber(req.body)
      .then(async (result) => {
        await new NotificationServices()
          .sendOTPSMS({ otp: req.body.otp, userPhoneNumber: userPhone })
          .then(() => {
            res.status(200);
            res.send({
              success: true,
              message: "Account information updated successfully",
            });
          })
          .catch(() => {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          });
      });
  }
  async updatephoneNumber(request: any, response: any) {
    if (request.body.otp === "1234") {
      try {
        await new UserServices().updatePhoneNumber(request.body).then((res) => {
          response.status(200);
          response.send({
            success: true,
            message: "Phone number updated successfully",
          });
        });
      } catch (error) {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong while updating phone number",
        });
      }
    } else {
      response.status(200);
      response.send({
        success: false,
        message:
          "Incorrect OTP. Please try again, or go back to re-enter your number",
      });
    }
  }

  /**
   * updateAccountApproveStatus
   */
  public async sendAccountSetupMail(req: Request, res: Response) {
    let data = {
      sk: req.body.userSK,
      pk: req.body.userPK,
    };
    // fetch user details
    await new UserServices()
      .getUserData(data)
      .then(async (result) => {
        if (result.Item) {
          // Set user details
          let userDetails = {
            userName: result.Item.firstname,
            userEmail: result.Item.email,
          };
          await new MailServices()
            .accountSetupMail(userDetails)
            .then(async (result) => {
              let updateParams: UpdateCurrentStep = {
                sk: req.body.userSK,
                pk: req.body.userPK,
                currentStep: "finished",
              };
              await new UserServices()
                .updateCurrentSteps(updateParams)
                .then(async (UserData) => {
                  try {
                    if (!UserData?.Attributes?.stripeID) {
                      const stripeCust =
                        await new StripeServices().createCustomer({
                          email: UserData?.Attributes?.email,
                          name: `${UserData?.Attributes?.firstname} ${UserData?.Attributes?.lastname}`,
                          customerId: UserData?.Attributes?.customerID,
                          pk: UserData?.Attributes?.pk,
                          sk: UserData?.Attributes?.sk,
                        });
                      const cus = await new UserServices().updateProfile({
                        sk: UserData?.Attributes?.sk,
                        pk: UserData?.Attributes?.pk,
                        fieldName: "stripeID",
                        fieldValue: stripeCust?.id,
                      });
                    }
                    res.status(200);
                    res.send({
                      success: true,
                      message: "Account configured mail sent.",
                    });
                  } catch (err) {
                    res.status(500);
                    res.send({
                      success: false,
                      message:
                        "Something went wrong, please try after sometime.",
                      error: err,
                    });
                  }
                })
                .catch((error) => {
                  res.status(500);
                  res.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: error,
                  });
                });
            })
            .catch((error) => {
              res.status(500);
              res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: error,
              });
            });
        } else {
          res.status(500);
          res.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
          });
        }
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  /**
   * fetchUserByRole
   */
  public async fetchUserByRole(req: Request, res: Response) {
    let role: any = req.query.role;
    await new UserServices()
      .getUserByRole(role)
      .then((result: any) => {
        res.status(200);
        res.send({
          success: true,
          message: "User data retrieved successfully.",
          data: result,
        });
      })
      .catch((err) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: err,
        });
      });
  }

  /**
   * addUser
   */
  public async addUser(req: Request, res: Response) {
    await new UserServices()
      .getUserIndexByEmail(req.body.email)
      .then(
        async (result: PromiseResult<DocumentClient.QueryOutput, AWSError>) => {
          if (result.Count && result.Count > 0) {
            res.status(200);
            res.send({
              success: false,
              message: "An account already exists for this email address",
            });
          } else {
            new UserServices()
              .generateRandomCustomerID(req.body.country)
              .then(async (cID) => {
                if (cID) {
                  req.body.customerId = String(cID);
                  let userRole = req.body.userRole;
                  // create sk, pk and role
                  req.body.userPK = req.body.customerId;
                  req.body.userSK = `${userRole}#${req.body.customerId}`;
                  // token params
                  let tokenParams = {
                    pk: req.body.userPK,
                    sk: req.body.userSK,
                    userRole: req.body.userRole,
                  };
                  // add user
                  await new UserServices()
                    .insertUser(req.body)
                    .then(
                      async (
                        result: PromiseResult<
                          DocumentClient.PutItemOutput,
                          AWSError
                        >
                      ) => {
                        // send create password email
                        // create token
                        let token = jwt.sign(
                          tokenParams,
                          process.env.JWT_SECRET_KEY as string,
                          {
                            expiresIn: "45m",
                          }
                        );
                        // mail data
                        let mailData = {
                          email: req.body.email,
                          token: token,
                        };
                        // send mail
                        await new MailServices().sendMailForgotPassword(
                          mailData
                        );
                        // return response
                        res.status(200);
                        res.send({
                          success: true,
                          message: "User added successfully!",
                          data: result,
                        });
                      }
                    )
                    .catch((error: AWSError) => {
                      res.status(500);
                      res.send({
                        success: false,
                        message:
                          "Something went wrong, please try after sometime.",
                        error: error,
                      });
                    });
                } else {
                  res.status(500);
                  res.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                  });
                }
              })
              .catch((err) => {
                res.status(500);
                res.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error: err,
                });
              });
          }
        }
      )
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  // updatePricingPlanStatus
  public async enablePricingPlanPage(request: Request, response: Response) {
    let userData: UpdatePricingPlanObj = {
      userPK: request.body.userPK,
      userSK: request.body.userSK,
      status: request.body.pricingPlan,
    };
    await new UserServices()
      .updatePricingPlanStatus(userData)
      .then(
        (result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>) => {
          response.status(200);
          response.send({
            success: true,
            message: "Pricing plan status updated.",
          });
        }
      )
      .catch((error: AWSError) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong while updating phone number",
          error: error,
        });
      });
  }

  // updatePricingPlanStatus
  public async sendOtpToUser(request: Request, response: Response) {
    try {
      // generate otp
      request.body.otp = Math.floor(Math.random() * 9000 + 1000);
      await new UserServices()
        .updateOTP(request.body)
        .then(
          async (
            result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>
          ) => {
            if (result.Attributes) {
              let userPhone: string =
                result?.Attributes?.dialCode +
                "" +
                result?.Attributes?.phoneNumber;
              // sent otp
              await new NotificationServices()
                .sendOTPSMS({
                  otp: request.body.otp,
                  userPhoneNumber: userPhone,
                })
                .then(() => {
                  response.status(200);
                  response.send({
                    success: true,
                    message: "OTP sent successfully",
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
  }

  // for update flex tokens
  async updateFlexTokens(request: Request, response: Response) {
    await new UserServices()
      .updateFlexTokens(request.body)
      .then(
        (result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>) => {
          if (result.Attributes) {
            response.status(200);
            response.send({
              success: true,
              message: "Configuration tokens updated successfully.",
              data: result.Attributes,
            });
          } else {
            response.status(500);
            response.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        }
      )
      .catch((error) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  // update flex password and email
  async updateFlexDetailsByDriver(request: Request, response: Response) {
    let flexData = {
      pk: request.body.pk,
      sk: `flexDetails#${request.body.pk}`,
      amznFlexUser: request.body.amznFlexUser,
      amznFlexPassword: request.body.amznFlexPassword,
    };
    // update flex data
    await new UserServices()
      .updateFlexDetailsByDriver(flexData)
      .then(
        (result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>) => {
          if (result.Attributes) {
            response.status(200);
            response.send({
              success: true,
              message: "Flex details updated successfully.",
              data: result.Attributes,
            });
          } else {
            response.status(500);
            response.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        }
      )
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
