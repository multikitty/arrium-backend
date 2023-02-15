import { BlockAlertObject, PaymentAlertObject, AlertObject, NotificationObject, UpdateAlertObject } from "../Interfaces/alertInterface";
import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB";
import AWS from "aws-sdk";

export default class AlertServices {

  public insertPaymentAlert(data: PaymentAlertObject) {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: `${data.currentTime}#${data.notifType}#${data.invID}`,
          notifType: data.notifType,
          notifViewed: data.notifViewed
        },
        TableName: TableName,
      })
      .promise();
  }

  public insertBlockAlert(data: BlockAlertObject) {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: `notif#${data.notifType}#${data.currentTime}#${data.offerID}`,
          price: data.price,
          bStartTimeU: data.bStartTimeU,
          bEndTimeU: data.bEndTimeU,
          stationCode: data.stationCode,
          stationName: data.stationName,
          sessionTimeU: data.sessionTimeU,
          notifType: data.notifType,
          notifDismiss: data.notifDismiss,
          notifViewed: data.notifViewed
        },
        TableName: TableName,
      })
      .promise();
  }

  public getBlockNotification(pk: string) {
    let queryParams = {
      TableName: TableName,
      ScanIndexForward: true,
      ConsistentRead: false,
      KeyConditionExpression: `#bef90 = :bef90 and begins_with(#bef91,:bef91)`,
      ExpressionAttributeValues: {
        ":bef90": pk,
        ":bef91": `notif#block#`
      },
      "ExpressionAttributeNames": {
        "#bef90": "pk",
        "#bef91": "sk"
      }
    }
    return dynamoDB.query(queryParams).promise();
  }

  async updateAllBlockAlertbyViewed(pk: string, sk: string) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: pk,
          sk: sk
        },
        UpdateExpression: 'SET notifViewed = :update',
        ConditionExpression: 'notifViewed = :notifViewed and sk = :sk and notifType = :notifType ',
        ExpressionAttributeValues: {
          ':notifViewed': false,
          ':update': true,
          ':sk': sk,
          ':notifType': 'block'
        },
      })
      .promise();
  }

  async updateBlockAlertbyDismiss(pk: string, sk: string, currentTime: number) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          PK: pk,
          notifDismiss: false
        },
        UpdateExpression: 'SET notifDismiss = :notifDismiss AND expDate= :expDate',
        ExpressionAttributeValues: {
          ':notifDismiss': true,
          ':expDate': currentTime
        },
      })
      .promise();
  }

  async updateAllBlockAlertbyDismiss(pk: string, currentTime: number) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          PK: pk
        },
        UpdateExpression: 'SET notifDismiss = :updateNotifDismiss AND expDate= :expDate',
        ConditionExpression: 'notifDismiss = :notifDismiss and SK contains :type',
        ExpressionAttributeValues: {
          ':notifDismiss': false,
          ':updateNotifDismiss': true,
          ':expDate': currentTime
        },
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
