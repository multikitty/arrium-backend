import bcrypt from 'bcryptjs';
import { dynamoDB, TableName } from '../Utils/dynamoDB';

export const SignupServices = {
  signupRegistrationService: async (data: any) => {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: data.sk,
          email: data.email,
          password: bcrypt.hashSync(data.password, 10),
          refCode: data.fullRefCode,
          role: data.role,
          emailVerified: false,
          currentSteps: 'account_info',
          customerID: data.customerId,
          startDate: (Date.now() / 1000) | 0, //time in unix,
          accountStatus: 'active',
          planType: 'basic',
          region : "",
          otp : "",
          pricingPlan : false,
          country: data.country
        },
        TableName: TableName,
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
        UpdateExpression: `set firstname = :firstname, lastname= :lastname, country= :country, otp= :otp, dialCode= :dialCode, phoneNumber= :phoneNumber, tzName = :tzName, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ':firstname': data.firstname,
          ':lastname': data.lastname,
          ':country': data.country,
          ':dialCode': data.dialCode,
          ':phoneNumber': data.phoneNumber,
          ':tzName': data.tzName,
          ':otp': data.otp,
          ':currentSteps': 'otp',
        },
        ReturnValues: 'ALL_NEW',
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
          ':phoneVerified': true,
          ':currentSteps': 'amazon_flex',
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
  },

  updateAmazonFlexInfoService: async (data: any) => {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: data.sk,
          amznFlexUser: data.amznFlexUser,
          amznFlexPassword: data.amznFlexPassword,
        },
        TableName: TableName,
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
        AttributesToGet: ['firstname', 'lastname', 'email', 'otp'],
      })
      .promise();
  },
};
