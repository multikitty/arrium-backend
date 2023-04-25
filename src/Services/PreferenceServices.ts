import { TableName, dynamoDB } from "../Utils/dynamoDB";
import moment from "moment";
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
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
        ":bef91": `availability#${data.day ?? ""}`,
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk",
      },
    };
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
        ":bef91": `schedule#${data.pk}#`,
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk",
      },
    };
    return dynamoDB.query(params).promise();
  }

  public async creactAutomationSchedule(data: any) {
    const functionName = "Eventbridge-rule-creation-trigger";
    for (let i = 0; i < data.length; i++) {
      const utcTime = moment.utc(data[i].asStartTime, "HH:mm:ss");
      const payload = JSON.stringify({
        token: data[i].token,
        day: data[i].asDay,
        scheduleNumber: data[i].scheduleNumber,
        active: data[i].active,
        time: utcTime.format("YYYY-MM-DD HH:mm:ss [UTC]"),
      });
      const params = {
        FunctionName: functionName,
        Payload: payload,
      };

      lambda.invoke(
        params,
        function (
          err: { stack: any },
          data: { Payload: { toString: () => any } }
        ) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data.Payload.toString());
          }
        }
      );
    }

    return data;
  }
}
