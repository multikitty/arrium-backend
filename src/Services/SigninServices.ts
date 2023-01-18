import { dynamoDB, TableName, GSI } from "../Utils/dynamoDB";

export const SigninServices = {
  loginService: async (data: any) => {
    let queryParams = {
      IndexName: GSI.login,
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": data.email,
      },
      TableName: TableName
    };
    return dynamoDB.query(queryParams).promise();
  },
};
