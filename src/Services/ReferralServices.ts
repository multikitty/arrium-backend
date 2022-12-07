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


    /**
        * findReferralCode
        */
    public async findReferralCode(refCode : string) {
        return await dynamoDB
            .get({
                TableName: TableName,
                Key: {
                    pk: "referral",
                    sk: `referral#${refCode}`,
                },
            }).promise();
    }   

    /**
     * udpateReferralCodeStatus
     */
    public async udpateReferralCodeStatus(data: any) {
        let params = {
            TableName: TableName,
            Key: {
                pk: "referral",
                sk: `referral#${data.refCode}`
            },
            UpdateExpression: "SET #3b1e0 = :3b1e0",
            ExpressionAttributeValues: {
                ":3b1e0": data.status
            },
            ExpressionAttributeNames: {
                "#3b1e0": "refActive"
            }
        }
        return await dynamoDB.update(params).promise();
    }
}