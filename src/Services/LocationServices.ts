import { dynamoDB, TableName } from "Utils/dynamoDB"


export class LocationServices {


    /**
    * addAddress
    */
    public addAddress(data : any) {
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


}