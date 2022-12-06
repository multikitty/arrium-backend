import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB";



export default class ReferralServices {

    // referral code by creator
    public async getRefGenBy(userPK: string | undefined) {
        let queryInput = {
            TableName: TableName,
            IndexName: GSI.refByCreator,
            ConsistentRead: false,
            ScanIndexForward: true,
            KeyConditionExpression: "#8dca0 = :8dca0",
            ExpressionAttributeValues: {
                ":8dca0": userPK
            },
            ExpressionAttributeNames: {
                "#8dca0": "refGenBy"
            }
        }
        return await dynamoDB.query(queryInput).promise();
    }

    // referral code by Sales Agents
    public async getRefGenFor(userPK: string | undefined) {
        let queryInput = {
            TableName: TableName,
            IndexName: GSI.refByAgent,
            ConsistentRead: false,
            ScanIndexForward: true,
            KeyConditionExpression: "#8dca0 = :8dca0",
            ExpressionAttributeValues: {
                ":8dca0": userPK
            },
            ExpressionAttributeNames: {
                "#8dca0": "refGenFor"
            }
        }
        return await dynamoDB.query(queryInput).promise();
    }
}