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
      ScanIndexForward: true,
      ConsistentRead: false,
      KeyConditionExpression: "#bef90 = :bef90 And begins_with(#bef91, :bef91)",
      ExpressionAttributeValues: {
        ":bef90": data.pk,
        ":bef91": "flexDetails#"
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk"
      }
    }
    return dynamoDB.query(params).promise();
  }
  
  /**
  * updateFlexDetails
  */
  public updateFlexDetails(data: Object) {
    console.log(data)
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
  //update user account info 
  async updateAccountInfo(data: any) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.userPK,
          sk: data.userSK,
        },
        UpdateExpression: `set firstname = :firstname, lastname= :lastname, phoneNumber= :phoneNumber, email= :email, emailVerified = :emailVerified, tzName = :tzName, role = :role, accountStatus = :accountStatus`,
        ExpressionAttributeValues: {
          ":firstname": data.firstname,
          ":lastname": data.lastname,
          ":phoneNumber": data.phoneNumber,
          ":email": data.email,
          ":emailVerified": data.emailVerified,
          ":tzName": data.tzName,
          ":role": data.role,
          ":accountStatus": data.status,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }
  // fetch user list
  async getAllUsers(data: any) {
    if(data.sk && data.pk) {
      return dynamoDB
        .scan({
          IndexName: GSI.login,
          TableName: TableName,
          ConsistentRead: false,
          ExclusiveStartKey: {
            pk: data.pk,
            sk: data.sk
          },
          Limit: 4,
        })
        .promise();
    } else {
      return dynamoDB
        .scan({
          IndexName: GSI.login,
          TableName: TableName,
          ConsistentRead: false,
          Limit: 4,
        })
        .promise();
    }
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

// export default new userServices();
