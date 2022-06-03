import bcrypt from 'bcryptjs'
import { dynamoDB, TableName } from './../Utils/dynamoDB';

export const authServices = {
  signupCheckExistEmail: async (data: any) => {
    return dynamoDB.scan({
      TableName: TableName,
      FilterExpression:
        "contains(email, :email)",
      ExpressionAttributeValues: {
        ":email": data.email,
      },
    })
    .promise()
  },


  signupRegistrationService: async (data: any) => {
    return dynamoDB.put({
      Item: {
        pk: "u#"+data.email,
        sk: "login#"+data.email,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
        refCode: data.refCode,
        role: "driver",
        emailVerified: "unverified",
        currentSteps: "Account Info",
        created_at: Date.now() / 1000 | 0 //time in unix
      },
      TableName: TableName,
    })
      .promise()
  },

  findIfCustomerIdExist:async (data: any) => {
    return dynamoDB.scan({
      TableName: TableName,
      FilterExpression:
        "contains(customerID, :customerID)",
      ExpressionAttributeValues: {
        ":customerID": data,
      },
    })
      .promise()
  },

  addCustomerId:async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: "u#"+data.email,
          sk: "login#"+data.email,
        },
        UpdateExpression: `set customerID = :customerID`,
        ExpressionAttributeValues: {
          ":customerID": data.randomNumber,
        },
        ReturnValues: "ALL_NEW",//will return all Attributes in response
      })
      .promise()
  },

  loginService: async (data: any) => {
    return dynamoDB.scan({
      TableName: TableName,
      FilterExpression:
        // "contains(email, :email) AND contains ( password, :password)",
        "contains(email, :email)",
      ExpressionAttributeValues: {
        ":email": data.email,
        // ":password": data.password,
      },
    })
      .promise()
  },


  AccountInfoService: async (data: any) => {
    console.log(data)
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set firstname = :firstname, lastname= :lastname, phoneNumber= :phoneNumber, tzName = :tzName, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":firstname": data.firstname,
          ":lastname": data.lastname,
          ":phoneNumber": data.phoneNumber,
          ":tzName": data.tzName,
          ":currentSteps": "OTP Confirmation"
        },
        ReturnValues: "ALL_NEW",//will return all Attributes in response
      })
      .promise()
  },

 

  SignupOTPConfirmationService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set phoneVerified = :phoneVerified, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":phoneVerified": "verified",
          ":currentSteps": "Amazon Flex Info"
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
  },
  
  updateAmazonFlexInfoService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set amznFlexUser = :amznFlexUser, amznFlexPassword= :amznFlexPassword, currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ":amznFlexUser": data.amznFlexUser,
          ":amznFlexPassword": data.amznFlexPassword,
          ":currentSteps":"Finish"
        },
      })
      .promise()
  },

  signupSendMailService: async (data: any) => {
    return dynamoDB.get({
      TableName: TableName,
      Key: {
        pk: data.pk,
        sk: data.sk
      },
      AttributesToGet: [
        'firstname', 'lastname', 'email'
     ]
    })
      .promise()
  },

  updateEmailVerifyService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set emailVerified = :emailVerified`,
        ExpressionAttributeValues: {
          ":emailVerified": "verified",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
  },

  forgotPasswordService :async (data:any) => {
    const params = {
      TableName: TableName,
      Key:
      {
        pk: `u#${data.email}`,
        sk: `login#${data.email}`
      },
      AttributesToGet: [
         'firstname', 'lastname', 'email'
      ]
  }
  var exists = null
  let result = await dynamoDB.get(params).promise();
  if (result.Item !== undefined && result.Item !== null) {
    exists = result.Item
  }else{
    exists = false
  }
  return (exists)
  },


  setNewPasswordService: async (data: any) => {
      return dynamoDB.update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk
        },
        UpdateExpression: `set password = :password`,
        ExpressionAttributeValues: {
          ":password": bcrypt.hashSync(data.password, 10),
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
  }




}