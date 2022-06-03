import { dynamoDB, TableName } from './../Utils/dynamoDB';

export const userServices = {
  getUserDataService: async (data: any) => {
    return dynamoDB
      .get({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: data.sk
        },
      })
      .promise()
  },

  getAllUsersService: async (data: any) => {
    return dynamoDB
      .scan({
        TableName: TableName,
        Limit: 5,
      })
      .promise()
  },

  updateProfileService: async (data: any) => {
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
        ReturnValues: "ALL_NEW",//will return all Attributes in response
      })
      .promise()
  },

  updateEmailService: async (data:any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set email = :email, emailVerified = :emailVerified, sk = :sk, pk = :pk`,
        ExpressionAttributeValues: {
          ":email": data.fieldValue,
          ":emailVerified": "unverified",
          ":sk": `login#${data.fieldValue}`,
          ":pk": `u#${data.fieldValue}`
        },
        ReturnValues: "ALL_NEW",
      })
      .promise()
  },

  currentPasswordService : async(data:any) => {
    return dynamoDB.get({
      TableName: TableName,
      Key: {
        pk: data.pk,
        sk: data.sk
      },
      AttributesToGet: ['password']
    })
      .promise()
  },

  updatePhoneNumberService: async (data: any) => {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          sk: data.sk,
          pk: data.pk
        },
        UpdateExpression: `set phoneNumber= :phoneNumber, phoneVerified= :phoneVerified`,
        ExpressionAttributeValues: {
          ":phoneNumber": data.phoneNumber,
          ":phoneVerified": "unverified"
        },
        ReturnValues: "ALL_NEW",//will return all Attributes in response
      })
      .promise()
  }

}