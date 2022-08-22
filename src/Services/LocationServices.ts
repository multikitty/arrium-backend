import { AddCountryObj } from "../Interfaces/countryInterface"
import { dynamoDB, TableName } from "../Utils/dynamoDB"


export class LocationServices {

    // add coutnry 
    public setCountry(data : AddCountryObj) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              country: data.country,
              countryCode: data.countryCode
            }
        }
        return dynamoDB.put(params).promise()
    }

    /**
    * getCountryList 
    */
    public getCountryList() {
        let queryInput = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: "#69240 = :69240",
            ExpressionAttributeValues: {
                ":69240" : "country"
            },
            ExpressionAttributeNames: {
                "#69240": "pk"
            }
        }

        return dynamoDB.query(queryInput).promise();
    }

}