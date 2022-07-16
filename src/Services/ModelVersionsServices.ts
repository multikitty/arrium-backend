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
    * getPhoneModelList
    */
    public getPhoneModelList(data : any) {
        let params = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            Limit: 1,
            KeyConditionExpression: "#69240 = :69240",
            ExpressionAttributeValues: {
              ":69240": "phoneModel"
            },
            ExpressionAttributeNames: {
              "#69240": "pk"
            }
        }

        return dynamoDB.query(params).promise();
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
}