import { dynamoDB, TableName } from "../Utils/dynamoDB";


export default class ModelVersionsServices {
   
    
    /**
    * addPhoneModel
    */
    public addPhoneModel(data : any) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              ModelName: data.modelName,
              ModelID: data.modelId
            }
        }
        return dynamoDB.put(params).promise()
    }   

   

    /**
    * addOsVersion
    */
    public addOsVersion(data : any) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              osVersion: data.osVersion
            }
        }
        return dynamoDB.put(params).promise()
    }   

     /**
    * addFlexVersion
    */
    public addFlexVersion(data : any) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              flexVersion: data.flexVersion
            }
        }
        return dynamoDB.put(params).promise()
    }  

     /**
    * Model version lists
    */
    public getModelVersionList(data : any) {
      // if(data.next_page) {
      //   return dynamoDB.query({
      //     TableName: TableName,
      //     ScanIndexForward: true,
      //     ConsistentRead: false,
      //     Limit: 10,
      //     KeyConditionExpression: "#69240 = :69240",
      //     ExpressionAttributeValues: {
      //       ":69240": data.entityName
      //     },
      //     ExpressionAttributeNames: {
      //       "#69240": "pk"
      //     },
      //     ExclusiveStartKey: {
      //       pk: data.pk,
      //       sk: data.sk,
      //     },
      //   }).promise();
      // } else {
        return dynamoDB.query({
          TableName: TableName,
          ScanIndexForward: true,
          ConsistentRead: false,
          KeyConditionExpression: "#69240 = :69240",
          ExpressionAttributeValues: {
            ":69240": data.entityName
          },
          ExpressionAttributeNames: {
            "#69240": "pk"
          }
        }).promise();
      // }
    }
}