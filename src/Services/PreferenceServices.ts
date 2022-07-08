import { TableName, dynamoDB } from '../Utils/dynamoDB';


export default class PreferenceServices {
    

    /**
    * add Preferences
    */
    public insertPreferences(data : any) {
        return dynamoDB.batchWrite({
            RequestItems: {
                [TableName] : data
            }
        }).promise()
    }


    /**
    * getLocationByUser
    */
    public getLocationByUser(countryCode: string) {
        let params = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: `#bef90 = :bef90 And begins_with(#bef91, :bef91)`,
            ExpressionAttributeValues: {
                ":bef90": "region",
                ":bef91": countryCode
            },
            ExpressionAttributeNames: {
                "#bef90": "pk",
                "#bef91": "sk"
            }
        }
        return dynamoDB.query(params).promise();
    }
    /**
    * getPreferenceByUser
    */
    public getPreferenceByUser(userPk: string) {
        let params = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: `#bef90 = :bef90 And begins_with(#bef91, :bef91)`,
            ExpressionAttributeValues: {
                ":bef90": userPk,
                ":bef91": "availability#"
            },
            ExpressionAttributeNames: {
                "#bef90": "pk",
                "#bef91": "sk"
            }
        }
        return dynamoDB.query(params).promise();
    }
};