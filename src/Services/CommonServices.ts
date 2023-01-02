import { EntitySkPk } from "../Interfaces/commonInterface";
import { dynamoDB, TableName } from "../Utils/dynamoDB";


export default class CommonServices {
    
     /**
    * delete any entity record
    */
    public deleteItem(data : EntitySkPk) {
        let params = {
            TableName: TableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            }
        }
        return dynamoDB.delete(params).promise();
    }
    
    
    // Batch write common method  
    public batchWriteData(data : any) {
        return dynamoDB.batchWrite({
            RequestItems: {
                [TableName] : data
            }
        }).promise()
    }

    async getEntity(data: EntitySkPk) {
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
}