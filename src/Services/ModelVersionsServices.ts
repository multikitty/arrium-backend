import { dynamoDB, TableName } from "../Utils/dynamoDB";


export default class ModelVersionsServices {
   
    
    /**
    * addPhoneModel
    */
    public addPhoneModel(data : any) {
        let params = {
            TableName: TableName,
            Item: {
              pk: {
                S: data.pk
              },
              sk: {
                S: data.sk
              },
              ModelName: {
                S: data.ModelName
              },
              ModelID: {
                S: data.ModelId
              }
            }
        }
        return dynamoDB.put(params).promise()
    }   

}