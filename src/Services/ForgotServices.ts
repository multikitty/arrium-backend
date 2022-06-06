import { dynamoDB, TableName } from "./../Utils/dynamoDB";
import bcrypt from "bcryptjs";

export const ForgotServices = {
  forgotPasswordService: async (data: any) => {
    const params = {
      TableName: TableName,
      Key: {
        pk: `u#${data.email}`,
        sk: `login#${data.email}`,
      },
      AttributesToGet: ["firstname", "lastname", "email"],
    };
    var exists = null;
    let result = await dynamoDB.get(params).promise();
    if (result.Item !== undefined && result.Item !== null) {
      exists = result.Item;
    } else {
      exists = false;
    }
    return exists;
  },

  setNewPasswordService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        UpdateExpression: `set password = :password`,
        ExpressionAttributeValues: {
          ":password": bcrypt.hashSync(data.password, 10),
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  },
};
