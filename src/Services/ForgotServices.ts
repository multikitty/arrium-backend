import { dynamoDB, TableName } from "../Utils/dynamoDB";
import bcrypt from "bcryptjs";

export const ForgotServices = {
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
