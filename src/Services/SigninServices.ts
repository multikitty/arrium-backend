import { dynamoDB, TableName } from "./../Utils/dynamoDB";

export const SigninServices = {
  loginService: async (data: any) => {
    return dynamoDB
      .scan({
        TableName: TableName,
        FilterExpression:
          // "contains(email, :email) AND contains ( password, :password)",
          "contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": data.email,
          // ":password": data.password,
        },
      })
      .promise();
  },
};
