import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserServices from "../Services/UserServices";
import StripeServices from "../Services/StripeServices";

export const SigninController = {
  login: async (request: any, response: any) => {
    try {
      await new UserServices()
        .getUserIndexByEmail(request.body.email)
        .then((result: any) => {
          if (result.Count === 0) {
            response.status(200);
            response.send({
              success: false,
              message: "Your login details are incorrect. Please try again!",
            });
          } else {
            let keyParams = {
              pk: result.Items[0]["pk"],
              sk: result.Items[0]["sk"],
              userRole: result.Items[0]["role"],
            };
            // match password
            bcrypt
              .compare(request.body.password, result.Items[0].password)
              .then(async (authenticated) => {
                if (authenticated === true) {
                  // create token
                  let token = jwt.sign(
                    keyParams,
                    process.env.JWT_SECRET_KEY as string,
                    {
                      expiresIn: 86400, // expires in 24 hours
                    }
                  );
                  result.Items[0]["token"] = token;
                  delete result.Items[0].password;

                  // user data
                  let userData = result.Items[0];
                  // get flex details
                  let params = {
                    pk: result.Items[0].pk,
                  };
                  let isFreeTrial = false;
                  if (userData && userData?.stripeID) {
                    const freeTrialExists =
                      await new StripeServices().checkFreeTrial(
                        userData.stripeID
                      );
                    isFreeTrial = freeTrialExists;
                  }
                  await new UserServices()
                    .fetchAmznFlexDetails(params)
                    .then(async (result: any) => {
                      await new UserServices()
                        .getPlansData({ pk: userData.pk, sk: userData.sk })
                        .then(async (result: any) => {
                          userData = {
                            ...userData,
                            planType: result.Item.planType,
                          };
                        });

                      if (result.Item) {
                        let responseData = {
                          userData: userData,
                          flexData: result.Item,
                          isFreeTrial,
                        };
                        response.status(200);
                        response.send({
                          success: true,
                          message: "Getting login data!",
                          data: responseData,
                        });
                      } else {
                        let responseData = {
                          userData: userData,
                          flexData: [],
                          isFreeTrial,
                        };
                        response.status(200);
                        response.send({
                          success: true,
                          message: "Getting login data!",
                          data: responseData,
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
                } else {
                  response.status(200);
                  response.send({
                    success: false,
                    message:
                      "Your login details are incorrect. Please try again!",
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
          }
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
};
