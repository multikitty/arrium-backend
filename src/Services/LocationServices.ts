import { AddCountryObj, AddRegionObj } from "../Interfaces/countryInterface"
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


    
    // add coutnry 
    public setRegion(data : AddRegionObj) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              regionName : data.regionName,
              regionCode : data.regionCode,
              regionID : data.regionId 
            }
        }
        return dynamoDB.put(params).promise()
    }


    /**
    * getRegionList 
    */
    public getRegionList(query : any) {
        if(query !== "" && query) {
            let queryInput = {
                TableName: TableName,
                ScanIndexForward: true,
                ConsistentRead: false,
                KeyConditionExpression: "#bef90 = :bef90 And begins_with(#bef91, :bef91)",
                ExpressionAttributeValues: {
                    ":bef90" : "region",
                    ":bef91" : query
                },
                ExpressionAttributeNames: {
                    "#bef90" : "pk",
                    "#bef91" : "sk"
                }
            }
            return dynamoDB.query(queryInput).promise();
        } else {
            let queryInput = {
               TableName: TableName,
               ScanIndexForward: true,
               ConsistentRead: false,
               KeyConditionExpression: "#69240 = :69240",
               ExpressionAttributeValues: {
                   ":69240" : "region"
               },
               ExpressionAttributeNames: {
                   "#69240": "pk"
               }
           }
           return dynamoDB.query(queryInput).promise();
        }

    }
}
