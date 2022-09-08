import bcrypt from "bcryptjs";
import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB";


export default class UserServices {
  // Fetch User by GSI Index from GSI-Login
  async getUserIndexByEmail(email : string) {
    let queryParams = {
      IndexName: GSI.login,
      KeyConditionExpression: "pkEmail = :pkEmail",
      ExpressionAttributeValues: {
        ":pkEmail": email,
      },
      TableName: TableName
    };
    return dynamoDB.query(queryParams).promise();
  }

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
  // get amazon flex details
  async fetchAmznFlexDetails(data: any) {
    let params = {
      TableName : TableName,
      Key: {
        pk:  data.pk,
        sk: `flexDetails#${data.pk}`
      }
    }
    return dynamoDB.get(params).promise();
  }
  
  /**
  * updateFlexDetails
  */
  public updateFlexDetails(data: any) {
    let params = {
      TableName: TableName,
      Key: {
        pk: data.userPk,
        sk: `flexDetails#${data.userPk}`,
      },
      UpdateExpression: `SET 
        amznFlexUser = :flexUser, 
        amznFlexPassword= :flexPassword, 
        devModel= :devModel, 
        devType= :devType,
        devID= :devId,  
        devSerial= :devSerialNumber, 
        osVersion= :osVersion, 
        flexVersion= :flexVersion, 
        awsreg1= :awsReg1,
        cogid1= :cogId1,
        awsreg2= :awsReg2,
        cogid2= :cogId2, 
        amznID= :amznId,
        flexID= :flexId,
        country= :country,
        #attrRegion= :region, 
        planName= :planName,
        blockType= :blockType
      `,
      ExpressionAttributeNames: {
        "#attrRegion": 'region'
      },
      ExpressionAttributeValues: {
        ":flexUser": data.flexUser,
        ":flexPassword": data.flexPassword,
        ":devModel": data.devModel,
        ":devType": data.devType,
        ":devId": data.devId,
        ":devSerialNumber": data.devSerialNumber,
        ":osVersion": data.osVersion,
        ":flexVersion": data.flexVersion,
        ":awsReg1": data.awsReg1,
        ":cogId1": data.cogId1,
        ":awsReg2": data.awsReg2,
        ":cogId2": data.cogId2,
        ":amznId": data.amznId,
        ":flexId": data.flexId,
        ":country": data.country,
        ":region": data.region,
        ":planName": data.planName,
        ":blockType": data.blockType,
      },
      ReturnValues: "ALL_NEW",
    }
    return dynamoDB.update(params).promise()
  }

  //update user account info 
  async updateAccountInfo(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.userPK,
          sk: data.userSK,
        },
        UpdateExpression: `SET 
          firstname = :firstname, 
          lastname= :lastname, 
          phoneNumber= :phoneNumber, 
          email= :email,
          pkEmail= :email,  
          emailVerified= :emailVerified, 
          tzName= :tzName, 
          #attrRole= :role, 
          accountStatus= :accountStatus,
          startDate= :startDate,
          endDate= :endDate
        `,
        ExpressionAttributeNames: {
          "#attrRole": 'role'
        },
        ExpressionAttributeValues: {
          ":firstname": data.firstname,
          ":lastname": data.lastname,
          ":phoneNumber": data.phoneNumber,
          ":email": data.email,
          ":emailVerified": data.emailVerified,
          ":tzName": data.tzName,
          ":role": data.userRole,
          ":accountStatus": data.status,
          ":startDate": data.startDate,
          ":endDate": data.endDate,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }
  // fetch user list
  async getAllUsers(data: any) {
    return dynamoDB
      .scan({
        IndexName: GSI.login,
        TableName: TableName,
        ConsistentRead: false,
      })
      .promise();

    // if(data.nextPage) {
    //   return dynamoDB
    //     .scan({
    //       TableName: TableName,
    //       IndexName: GSI.login,
    //       ConsistentRead: false,
    //       ExclusiveStartKey: {
    //         pk: data.pk,
    //         sk: data.sk,
    //         customerID: data.customerID,
    //         pkEmail: data.pkEmail
    //       },
    //       Limit: 10,
    //     })
    //     .promise();
    // } else { 
    // }
  }
  // update mail verify status
  async updateEmailVerify(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
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
