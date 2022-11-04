import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import MailServices from "../Services/MailServices";

import UserServices from "../Services/UserServices";
import { Request, Response } from "express";

export default class UserController {
  // get logged in user data
  async getUserData(request: any, response: any) {
    try {
      await new UserServices().getUserData(request.body).then((result) => {
        if (result.Item) {
          delete result.Item.password;
          response.status(200);
          response.send({
            success: true,
            message: "User data retrived successfully",
            data: result.Item,
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
  }
  // get amzn flex details
  async getAmznFlexDetails(request: any, response: any) {
    try {
      await new UserServices().fetchAmznFlexDetails(request.params).then((result : any) => {
        if(result.Item) {
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
  }
  /**
  * updateAmznFlexDetails
  */
  public async updateAmznFlexDetails(request: Request, response : Response) {
    await new UserServices().updateFlexDetails(request.body)
    .then(async (result : any) => {
      // handle result 
      if(result.Attributes) {
        const responseData = result.Attributes; 
        // udpate changes in user entity
        let countryRegionData = {
          userPk : request.body.userPk,
          userSk : request.body.userSk,
          country : result.Attributes.country,
          region : result.Attributes.region
        }
        await new UserServices().updateUserCountryRegion(countryRegionData)
        .then((result) => {
          if(result) {
            response.status(200);
            response.send({
              success: true,
              message: "Configuration details updated successfully.",
              data: responseData
            });
          } else {
            response.status(500);
            response.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
            });
          }
        }).catch((error : any) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error : error
          });
        })
      } else {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
        });
      }
    })
    .catch((error : any) => {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });
    })
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
        }).catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    }
  }
  // update account info
  async updateAccountInfo(request: any, response: any) {
    try {
      await new UserServices()
      .updateAccountInfo(request.body)
      .then((result) => {
        if (result.Attributes) {
          response.status(200);
          response.send({
            success: true,
            message: "User Account Information updated successfully",
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
  }
  // fetch user list
  async listAllUsers(request: any, response: any) {
    if (request.body.role === "admin") {
      try {
        await new UserServices().getAllUsers(request.query).then((result: any) => {
          response.status(200);
          response.send({
            success: true,
            message: "User data retrieved successfully.",
            data: result,
          });
        }).catch((err) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error : err
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
    } else {
      response.status(403);
      response.send({
        success: false,
        message: "Access denied!",
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
          userRole: request.body.role
        },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: '15m', // expires in 15 minutes
        }
      );
      // email data
      const emailData = {
        email: request.body.email,
        token,
      };
      //send email verifcation link
      new MailServices().sendMailEmailVerification(emailData).then((res) => {
        response.status(200);
        response.send({
          success: true,
          message: "Verification email sent successfully",
        });
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
              .updateEmailVerify(request.body)
              .then((result) => {
                response.status(200);
                response.send({
                  success: true,
                  message: "Your email verified successfully",
                });
              }).catch((error) => {
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
        error : error
      });
    }
  }

  async updateProfileDetails(req: Request, res: Response) {
    try {
      await new UserServices().updateProfile(req.body).then(async (result) => {
        res.status(200);
        res.send({
          success: true,
          message: `Updated successfully`,
          data : result
        });
      }).catch((err) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong while updating your profile data.",
          error : err
        });
      });
    } catch (err) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong while updating your profile data.",
        error : err
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
            new UserServices().setNewPassword(request.body).then((result) => {
              response.status(200);
              response.send({
                success: true,
                message: "New Password updated successfully",
              });
            }).catch((error) => {
              response.status(500);
              response.send({
                success: false,
                message: "Something went wrong, Please try again after sometime.",
                error : error
              });
            })
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "The current password is incorrect. Please try again!",
            });
          }
        }).catch((error) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, Please try again after sometime.",
            error : error
          });
        })
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while updating your password",
        error : error
      });
    }
  }

  /**
    * Update email
    */
  public async updateEmail(req: Request, res: Response) {
    await new UserServices().updateEmail(req.body).then((result) => {
        //  email verification token
        let token = jwt.sign(
          {
            pk: req.body.pk,
            sk: req.body.sk,
            userRole: req.body.role
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
        new MailServices()
          .sendMailEmailVerification(emailData)
          .then((mailResponse) => {
            res.status(200);
            res.send({
              success: true,
              message: "Email updated successfully, please check verification mail.",
            });
          }).catch((error : any) => {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
              error : error
            });
          })
    }).catch((error : any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });
    })
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
  public async updateAccountApproveStatus(req: Request, res: Response) {
    let data = {
      sk : req.body.userSK,
      pk : req.body.userPK,
      currentStep : req.body.status === true ? "finished" : "on-hold" 
    }
    await new UserServices().updateCurrentSteps(data).then((result) => {
      res.status(200);
      res.send({
        success: true,
        message: "Updated successfully.",
      });
    }).catch((error) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });
    });
  }

}
