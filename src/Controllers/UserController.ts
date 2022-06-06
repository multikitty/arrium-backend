import bcrypt from "bcryptjs";
import { authServices } from "./../Services/AuthServices";
import { userServices } from "./../Services/UserServices";

export const userController = {
  getUserData: async (request: any, response: any) => {
    try {
      await userServices.getUserDataService(request.body).then((result) => {
        if (result.Item) {
          delete result.Item.password;
          delete result.Item.amznFlexPassword;

          response.status(200);
          response.send({
            success: true,
            message: "User data retrived successfully!",
            data: result.Item,
          });
        }
      });
    } catch (error) {
      response.status(200);
      response.send({
        success: false,
        message: "Something went wrong while getting users",
      });
    }
  },

  getAllUsers: async (request: any, response: any) => {
    try {
      await userServices
        .getAllUsersService(request.body)
        .then((result: any) => {
          if (result.Items.length > 0) {
            response.status(200);
            response.send({
              success: true,
              message: "User data retrived successfully!",
              data: result.Items,
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
      response.status(200);
      response.send({
        success: false,
        message: "Something went wrong while gettting All Customers",
      });
    }
  },

  updateProfile: async (request: any, response: any) => {
    try {
      if (request.body.fieldName === "email") {
        await userServices.updateEmailService(request.body).then((res) => {
          response.status(200);
          response.send({
            success: true,
            message: `${request.body.fieldName} updated successfully!`,
          });
        });
      }

      await userServices.updateProfileService(request.body).then((res) => {
        response.status(200);
        response.send({
          success: true,
          message: `${request.body.fieldName} updated successfully!`,
        });
      });
    } catch (error) {
      response.status(200);
      response.send({
        success: false,
        message: "Something went wrong while updating your profile",
      });
    }
  },

  changePassword: async (request: any, response: any) => {
    try {
      const dbPassword: any = await userServices.currentPasswordService(
        request.body
      );
      bcrypt
        .compare(request.body.current_password, dbPassword.Item.password)
        .then((authenticated) => {
          if (authenticated) {
            // console.log('Okay password is matching');
            authServices.setNewPasswordService(request.body).then(() => {
              response.status(200);
              response.send({
                success: false,
                message: "New Password updated successfully!",
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
      response.status(200);
      response.send({
        success: false,
        message: "Something went wrong while updating your password",
      });
    }
  },

  updatephoneNumber: async (request: any, response: any) => {
    if (request.body.otp === "1234") {
      try {
        await userServices
          .updatePhoneNumberService(request.body)
          .then((res) => {
            response.status(200);
            response.send({
              success: true,
              message: "Phone number updated successfully!",
            });
          });
      } catch (error) {
        response.status(200);
        response.send({
          success: false,
          message: "Something went wrong while updating phone number!",
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
  },
};
