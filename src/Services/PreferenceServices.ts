import { TableName, dynamoDB } from '../Utils/dynamoDB';


export default class PreferenceServices {

    /**
    * getPreferenceByUser
    */
    public getPreferenceByUser(data: any) {
        let params = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: `#bef90 = :bef90 And begins_with(#bef91, :bef91)`,
            ExpressionAttributeValues: {
                ":bef90": data.userPK,
                ":bef91": `availability#${data.day ?? ""}`
            },
            ExpressionAttributeNames: {
                "#bef90": "pk",
                "#bef91": "sk"
            }
        }
        return dynamoDB.query(params).promise();
    }

    // get availability schedule
    public async getAvailabilitySchedule(data: any) {
        let params = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: `#bef90 = :bef90 And begins_with(#bef91, :bef91)`,
            ExpressionAttributeValues: {
                ":bef90": data.pk,
                ":bef91": `schedule#${data.pk}#`
            },
            ExpressionAttributeNames: {
                "#bef90": "pk",
                "#bef91": "sk"
            }
        }
        return dynamoDB.query(params).promise();
    }
};