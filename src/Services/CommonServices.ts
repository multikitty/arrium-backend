import { dynamoDB, TableName } from "../Utils/dynamoDB";


export default class CommonServices {
    
     /**
    * deleteModelVersion
    */
    public deleteItem(data : any) {
        let params = {
            TableName: TableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            }
        }
        return dynamoDB.delete(params).promise();
    }
}