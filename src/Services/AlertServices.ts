import {
  AlertObject,
  NotificationObject,
  UpdateAlertObject,
} from "../Interfaces/alertInterface";
import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB";
import AWS from "aws-sdk";

export default class AlertServices {
  public insertAlert(data: AlertObject) {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: `notification#${data.invoiceId}`,
          notificationType: data.notificationType,
          invoiceID: data.invoiceId,
          dismissed: data.dismissed,
        },
        TableName: TableName,
      })
      .promise();
  }

  async updateAlert(data: UpdateAlertObject) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: data.pk,
          sk: `notification#${data.invoiceId}`,
        },
        UpdateExpression: `SET 
        dismissed= :dismissed
          `,
        ExpressionAttributeValues: {
          ":dismissed": data.currentTime,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  }

  async sendNotification(params: NotificationObject) {
    const WebSocket = new AWS.ApiGatewayManagementApi({
      endpoint: process.env.WEB_SOCKET_END_POINT,
    });
    const { connectionId, message } = params;
    return await WebSocket.postToConnection({
      ConnectionId: connectionId,
      Data: message,
    }).promise();
  }
}
