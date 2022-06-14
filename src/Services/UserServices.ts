import bcrypt from "bcryptjs";
import { dynamoDB, TableName } from "../Utils/dynamoDB";

export default class UserServices {
  async getUserData(data: any) {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
      })
      .promise();
  }

  async getUserById(customerID: any) {
    return dynamoDB
      .scan({
        TableName: TableName,
        FilterExpression: "customerID = :customerID",
        ExpressionAttributeValues: {
          ":customerID": customerID,
        },
      })
      .promise();
  }

  async updateAccountInfoById(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.userSK,
          pk: data.userPK,
        },
        UpdateExpression: `set firstname = :firstname, lastname= :lastname, phoneNumber= :phoneNumber, email= :email, emailVerified = :emailVerified, tzName = :tzName`,
        ExpressionAttributeValues: {
          ":firstname": data.firstname,
          ":lastname": data.lastname,
          ":phoneNumber": data.phoneNumber,
          ":email": data.email,
          ":emailVerified": data.emailVerified,
          ":tzName": data.tzName,
          // ":role": data.role,
          // ":status": data.status,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }

  async getAllUsers(request: any) {
    let expression = "attribute_exists(customerID)";
    // const limit = request.query.limit || 10;
    if (request.query.search !== undefined) {
      expression =
        "attribute_exists(customerID) AND contains(#firstname, :firstname)";
      return dynamoDB
        .scan({
          TableName: TableName,
          FilterExpression: expression,
          ExpressionAttributeNames: {
            "#firstname": "firstname",
          },
          ExpressionAttributeValues: {
            ":firstname": request.query.search,
          },
          // ExclusiveStartKey: {
          //   pk: "u#dpddiglk10@plancetose.com",
          //   sk: "login#dpddiglk10@plancetose.com",
          // },
          // ProjectionExpression: "customerID",
          // Limit: 5,
        })
        .promise();
    } else {
      return dynamoDB
        .scan({
          TableName: TableName,
          FilterExpression: expression,
          // ExclusiveStartKey: {
          //   pk: "u#dpddiglk10@plancetose.com",
          //   sk: "login#dpddiglk10@plancetose.com",
          // },
          Limit: 30,
        })
        .promise();
    }
  }

  async updateEmailVerify(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set emailVerified = :emailVerified`,
        ExpressionAttributeValues: {
          ":emailVerified": true,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }

  async updateProfile(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        UpdateExpression: `set ${data.fieldName} = :fieldName`,
        ExpressionAttributeValues: {
          ":fieldName": data.fieldValue,
        },
        ReturnValues: "ALL_NEW", //will return all Attributes in response
      })
      .promise();
  }

  async changeEmail(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set email = :email, emailVerified = :emailVerified, sk = :sk, pk = :pk`,
        ExpressionAttributeValues: {
          ":email": data.fieldValue,
          ":emailVerified": "unverified",
          ":sk": `login#${data.fieldValue}`,
          ":pk": `u#${data.fieldValue}`,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }

  async currentPassword(data: any) {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        AttributesToGet: ["password"],
      })
      .promise();
  }

  async updatePhoneNumber(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set phoneNumber= :phoneNumber, phoneVerified= :phoneVerified`,
        ExpressionAttributeValues: {
          ":phoneNumber": data.phoneNumber,
          ":phoneVerified": true,
        },
        ReturnValues: "ALL_NEW", //will return all Attributes in response
      })
      .promise();
  }

  async setNewPassword(data: any) {
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
  }
}

// export default new userServices();
