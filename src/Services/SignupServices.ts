import bcrypt from "bcryptjs";
import { dynamoDB, TableName } from "./../Utils/dynamoDB";

export const SignupServices = {
  signupCheckExistEmail: async (data: any) => {
    return dynamoDB
      .scan({
        TableName: TableName,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": data.email,
        },
      })
      .promise();
  },

  signupRegistrationService: async (data: any) => {
    return dynamoDB
      .put({
        Item: {
          pk: "u#" + data.email,
          sk: "login#" + data.email,
          email: data.email,
          password: bcrypt.hashSync(data.password, 10),
          refCode: data.refCode,
          role: "driver",
          emailVerified: false,
          currentSteps: "account_info",
          customerID: data.randomNumber,
          created_at: (Date.now() / 1000) | 0, //time in unix
        },
        TableName: TableName,
      })
      .promise();
  },

  findIfCustomerIdExist: async (data: any) => {
    return dynamoDB
      .scan({
        TableName: TableName,
        FilterExpression: "contains(customerID, :customerID)",
        ExpressionAttributeValues: {
          ":customerID": data,
        },
      })
      .promise();
  },

  AccountInfoService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set firstname = :firstname, lastname= :lastname, phoneNumber= :phoneNumber, tzName = :tzName, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":firstname": data.firstname,
          ":lastname": data.lastname,
          ":phoneNumber": data.phoneNumber,
          ":tzName": data.tzName,
          ":currentSteps": "otp",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  },

  SignupOTPConfirmationService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set phoneVerified = :phoneVerified, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":phoneVerified": true,
          ":currentSteps": "amazon_flex",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  },

  updateAmazonFlexInfoService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set amznFlexUser = :amznFlexUser, amznFlexPassword= :amznFlexPassword, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":amznFlexUser": data.amznFlexUser,
          ":amznFlexPassword": data.amznFlexPassword,
          ":currentSteps": "finished",
        },
      })
      .promise();
  },

  signupSendMailService: async (data: any) => {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        AttributesToGet: ["firstname", "lastname", "email"],
      })
      .promise();
  },
};
