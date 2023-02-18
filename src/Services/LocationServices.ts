import { AddCountryObj, AddRegionObj, AddStationObj, AddStationTypeObj } from "../Interfaces/countryInterface"
import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB"


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
     public getCountry(skBeginsWith : string) {
        let queryInput = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: "#69240 = :69240 And begins_with(#bef91, :bef91)",
            ExpressionAttributeValues: {
                ":69240" : "country",
                ":bef91": `${skBeginsWith}`
            },
            ExpressionAttributeNames: {
                "#69240": "pk",
                "#bef91": "sk"
            }
        }

        return dynamoDB.query(queryInput).promise();
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
              regionID : data.regionId,
              iRegID : data.regionId,
              zendeskID : data.zendeskID
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


    // set station 
    public setStation(data : AddStationObj) {
        let params = {
            TableName: TableName,
            Item: {
                pk: data.pk,
                sk: data.sk,
                regionName : data.regionName,
                regionCode : data.regionCode,
                regionID : data.regionId,
                stationCode : data.stationCode,
                stationName : data.stationName,
                stationID : data.stationId,
                iStaID : data.stationId,
                stationType : data.stationType, 
                address1 : data.address1,
                address2 : data.address2,
                address3 : data.address3,
                city : data.city,
                state : data.state,
                postalCode : data.postalCode,
                latitude : data.latitude,
                longitude : data.longitude
            }
        }
        return dynamoDB.put(params).promise()
    }


    // set station type
    public setStationType(data : AddStationTypeObj) {
        let params = {
            TableName: TableName,
            Item: {
              pk: data.pk,
              sk: data.sk,
              stationType : data.stationType, 
            }
        }
        return dynamoDB.put(params).promise()
    }


    /**
    * getStationTypeList 
    */
    public getStationTypeList() {
        let queryInput = {
            TableName: TableName,
            ScanIndexForward: true,
            ConsistentRead: false,
            KeyConditionExpression: "#69240 = :69240",
            ExpressionAttributeValues: {
                ":69240" : "stationType"
            },
            ExpressionAttributeNames: {
                "#69240": "pk"
            }
        }

        return dynamoDB.query(queryInput).promise();
    }

    
    /**
    * getStationList 
    */
    public getStationList(query : any) {
        if(query) {
            let queryInput = {
                TableName: TableName,
                ScanIndexForward: true,
                ConsistentRead: false,
                KeyConditionExpression: "#bef90 = :bef90 And begins_with(#bef91, :bef91)",
                ExpressionAttributeValues: {
                    ":bef90" : "station",
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
                    ":69240" : "station"
                },
                ExpressionAttributeNames: {
                    "#69240": "pk"
                }
            }
            return dynamoDB.query(queryInput).promise();
        }
    }
    
    // region by index
    async getRegionByIndex(regionID: string) {
        let queryParams = {
            IndexName: GSI.regionByRegionID,
            KeyConditionExpression: 'iRegID = :iRegID',
            ExpressionAttributeValues: {
                ':iRegID': regionID,
            },
            TableName: TableName,
        };
        return dynamoDB.query(queryParams).promise();
    }

    // station by index
    async getStationByIndex(stationID: string) {
        let queryParams = {
            IndexName: GSI.stationByStationID,
            KeyConditionExpression: 'iStaID = :iStaID',
            ExpressionAttributeValues: {
                ':iStaID': stationID,
            },
            TableName: TableName,
        };
        return dynamoDB.query(queryParams).promise();
    }
}
