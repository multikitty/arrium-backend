import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import MailServices from "../Services/MailServices";

import UserServices from "../Services/UserServices";

export default class UserController {
  async getUserData(request: any, response: any) {
    try {
      await new UserServices().getUserData(request.body).then((result) => {
        if (result.Item) {
          delete result.Item.password;
          delete result.Item.amznFlexPassword;

          response.status(200);
          response.send({
            success: true,
            message: "User data retrived successfully",
            data: result.Item,
          });
        }
      });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while getting users",
      });
    }
  }

  async getUserById(request: any, response: any) {
    try {
      await new UserServices()
        .getUserById(request.params.id)
        .then((result: any) => {
          if (result.Count !== 0) {
            delete result.Items[0].password;
            delete result.Items[0].amznFlexPassword;

            response.status(200);
            response.send({
              success: true,
              message: "User data retrived successfully",
              data: result.Items[0],
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "No Customers Found",
            });
          }
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while getting users",
      });
    }
  }

  async updateAccountInfoById(request: any, response: any) {
    try {
      await new UserServices()
        .updateAccountInfoById(request.body)
        .then((result) => {
          if (result.Attributes) {
            response.status(200);
            response.send({
              success: true,
              message: "User Account Information updated successfully",
            });
          }
        });
    } catch (error) {
      console.log("getting error while update", error);
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while getting users",
      });
    }
  }

  async listAllUsers(request: any, response: any) {
    if (request.body.user_role === "admin") {
      try {
        await new UserServices().getAllUsers(request).then((result: any) => {
          if (result.Count !== 0) {
            response.status(200);
            response.send({
              success: true,
              message: "User data retrived successfully",
              data: result,
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "No Customers Found",
            });
          }
        });
      } catch (error) {
        console.log("getting error", error);
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong while gettting All Customers",
        });
      }
    } else {
      response.status(500);
      response.send({
        success: false,
        message: "You don't have permission to access this route",
      });
    }
  }

  async sendEmailVerify(request: any, response: any) {
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
      new MailServices().sendMailEmailVerification(emailData).then((res) => {
        response.status(200);
        response.send({
          success: true,
          message: "A Verification email sent successfully",
        });
      });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something work with db. Try after sometime",
      });
    }
  }

  async VerifyEmail(request: any, response: any) {
    try {
      await new UserServices()
        .updateEmailVerify(request.body)
        .then((result) => {
          response.status(200);
          response.send({
            success: true,
            message: "Your email verified successfully",
          });
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Oops something went wrong on email verification",
      });
    }
  }

  async updateProfile(request: any, response: any) {
    try {
      if (request.body.fieldName === "email") {
        await new UserServices().changeEmail(request.body).then((res) => {
          response.status(200);
          response.send({
            success: true,
            message: `${request.body.fieldName} updated successfully!`,
          });
        });
      }

      await new UserServices().updateProfile(request.body).then((res) => {
        response.status(200);
        response.send({
          success: true,
          message: `${request.body.fieldName} updated successfully`,
        });
      });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while updating your profile",
      });
    }
  }

  async changePassword(request: any, response: any) {
    try {
      const dbPassword: any = await new UserServices().currentPassword(
        request.body
      );
      bcrypt
        .compare(request.body.current_password, dbPassword.Item.password)
        .then((authenticated) => {
          if (authenticated) {
            new UserServices().setNewPassword(request.body).then(() => {
              response.status(200);
              response.send({
                success: false,
                message: "New Password updated successfully",
              });
            });
          } else {
            response.status(200);
            response.send({
              success: false,
              message: "The current password is incorrect. Please try again",
            });
          }
        });
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong while updating your password",
      });
    }
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
}
