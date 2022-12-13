import bcrypt from 'bcryptjs';
import { AddUserObj, UpdatePricingPlanObj } from '../Interfaces/userInterface';
import { dynamoDB, GSI, TableName } from '../Utils/dynamoDB';

export default class UserServices {
  // Fetch User by GSI Index from GSI-Login
  async getUserIndexByEmail(email: string) {
    let queryParams = {
      IndexName: GSI.login,
      KeyConditionExpression: 'pkEmail = :pkEmail',
      ExpressionAttributeValues: {
        ':pkEmail': email,
      },
      TableName: TableName,
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
  public async fetchAmznFlexDetails(data: any) {
    let params = {
      TableName: TableName,
      Key: {
        pk: data.pk,
        sk: `flexDetails#${data.pk}`,
      },
    };
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
        #attrRegion= :region
      `,
      ExpressionAttributeNames: {
        '#attrRegion': 'region',
      },
      ExpressionAttributeValues: {
        ':flexUser': data.flexUser,
        ':flexPassword': data.flexPassword,
        ':devModel': data.devModel,
        ':devType': data.devType,
        ':devId': data.devId,
        ':devSerialNumber': data.devSerialNumber,
        ':osVersion': data.osVersion,
        ':flexVersion': data.flexVersion,
        ':awsReg1': data.awsReg1,
        ':cogId1': data.cogId1,
        ':awsReg2': data.awsReg2,
        ':cogId2': data.cogId2,
        ':amznId': data.amznId,
        ':flexId': data.flexId,
        ':country': data.country,
        ':region': data.region,
      },
      ReturnValues: 'ALL_NEW',
    };
    return dynamoDB.update(params).promise();
  }

  // update user's regionCode and countryCode
  async updateUserCountryRegion(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.userPk,
          sk: data.userSk,
        },
        UpdateExpression: `SET 
            flexCountry= :flexCountry,
            #attrRegion= :region
          `,
        ExpressionAttributeNames: {
          '#attrRegion': 'region',
        },
        ExpressionAttributeValues: {
          ':flexCountry': data.country,
          ':region': data.region,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
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
          dialCode= :dialCode,
          email= :email,
          pkEmail= :email,  
          emailVerified= :emailVerified, 
          tzName= :tzName, 
          #attrRole= :role, 
          accountStatus= :accountStatus,
          startDate= :startDate,
          endDate= :endDate,
          planType= :planType,
          stationType= :stationType
        `,
        ExpressionAttributeNames: {
          '#attrRole': 'role',
        },
        ExpressionAttributeValues: {
          ':firstname': data.firstname,
          ':lastname': data.lastname,
          ':phoneNumber': data.phoneNumber,
          ":dialCode": data.dialCode,
          ':email': data.email,
          ':emailVerified': data.emailVerified,
          ':tzName': data.tzName,
          ':role': data.userRole,
          ':accountStatus': data.status,
          ':startDate': data.startDate,
          ':endDate': data.endDate,
          ':planType': data.planType,
          ':stationType': data.stationType,
        },
        ReturnValues: 'ALL_NEW',
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
          ':emailVerified': true,
        },
        ReturnValues: 'ALL_NEW',
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
          ':fieldName': data.fieldValue,
        },
        ReturnValues: 'ALL_NEW', //will return all Attributes in response
      })
      .promise();
  }

  async getUserCurrentPassword(data: any) {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        AttributesToGet: ['password'],
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
          ':phoneNumber': data.phoneNumber,
          ':phoneVerified': true,
        },
        ReturnValues: 'ALL_NEW', //will return all Attributes in response
      })
      .promise();
  }
  // for change password
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
          ':password': bcrypt.hashSync(data.newPassword, 10),
        },
      })
      .promise();
  }

  /**
   * updateEmail
   */
  public updateEmail(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk,
        },
        UpdateExpression: `set email= :email, pkEmail= :pkEmail, emailVerified= :emailVerified`,
        ExpressionAttributeValues: {
          ':email': data.email,
          ':pkEmail': data.email,
          ':emailVerified': false,
        },
      })
      .promise();
  }

  /**
   * udpate current step of user
   */
  public updateCurrentSteps(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk,
        },
        UpdateExpression: `set currentSteps= :currentSteps`,
        ExpressionAttributeValues: {
          ':currentSteps': data.currentStep,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();
  }

  // Get user list by role
  /**
    * getUserByRole
    */
  public async getUserByRole(role : string | string[] | undefined) {
    let queryInput = {
      TableName: TableName,
      IndexName: GSI.userByRole,
      ConsistentRead: false,
      ScanIndexForward: true,
      KeyConditionExpression: "#8dca0 = :8dca0",
      ExpressionAttributeValues: {
        ":8dca0": role
      },
      ExpressionAttributeNames: {
        "#8dca0": "role"
      }
    }
    return await dynamoDB.query(queryInput).promise();
  }

  // add user 
  /**
    * insertUser
    */
  public insertUser(data : AddUserObj) {
    return dynamoDB
    .put({
      Item: {
        pk: data.userPK,
        sk: data.userSK,
        firstname : data.firstname, 
        lastname : data.lastname, 
        phoneNumber: data.phoneNumber, 
        dialCode : data.dialCode,
        email: data.email,
        pkEmail: data.email,
        emailVerified: data.emailVerified,
        tzName : data.tzName,
        role: data.userRole,
        accountStatus: data.status,
        startDate: data.startDate,
        endDate : data.endDate,
        country: data.country,
        customerID: data.customerId,
        password: bcrypt.hashSync(Math.random().toString(20).substring(2), 10),
        phoneVerified : false,
        currentSteps: 'finished',
        planType: 'basic',
        region : "",
        otp : "",
      },
      TableName: TableName,
    })
    .promise();
  }

  // udpate pricing plan page status
  public updatePricingPlanStatus(data: UpdatePricingPlanObj) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.userPK,
          sk: data.userSK,
        },
        UpdateExpression: `set pricingPlan= :pricingPlan`,
        ExpressionAttributeValues: {
          ':pricingPlan': data.status
        }
      })
      .promise();
  }
}
