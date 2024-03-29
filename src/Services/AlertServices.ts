import {
  BlockAlertObject,
  NotificationWSObject,
  PaymentAlertObject,
} from "../Interfaces/alertInterface";
import { dynamoDB, GSI, TableName } from "../Utils/dynamoDB";
import AWS from "aws-sdk";

export default class AlertServices {
  public insertPaymentAlert(data: PaymentAlertObject) {
    return dynamoDB
      .put({
        Item: {
          pk: data.pk,
          sk: `notif#${data.notifType}#${data.currentTime}#${data.invID}`,
          notifType: data.notifType,
          notifViewed: data.notifViewed,
          invID: data.invID,
        },
        TableName: TableName,
      })
      .promise();
  }

  public updatePaymentAlert(pk: string, sk: string, currentTime: number) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: pk,
          sk: sk,
        },
        UpdateExpression: "SET expDate= :expDate",
        ConditionExpression: "sk = :sk and notifType = :type",
        ExpressionAttributeValues: {
          ":sk": sk,
          ":type": "invoice",
          ":expDate": currentTime,
        },
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
          notifViewed: data.notifViewed,
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
        ":bef91": `notif#block#`,
        ":notifDismiss": false,
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk",
      },
    };
    return dynamoDB
      .query({
        ...queryParams,
        FilterExpression: `notifDismiss = :notifDismiss`,
      })
      .promise();
  }

  public getConnectionId(pk: string) {
    let queryParams = {
      TableName: TableName,
      ScanIndexForward: true,
      ConsistentRead: false,
      KeyConditionExpression: `#bef90 = :bef90 and #bef91 = :bef91`,
      ExpressionAttributeValues: {
        ":bef90": pk,
        ":bef91": `driver#${pk.split("-")[pk.split("-").length - 1]}`,
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk",
      },
    };
    return dynamoDB.query({ ...queryParams }).promise();
  }

  public getInvoiceNotification(pk: string) {
    let queryParams = {
      TableName: TableName,
      ScanIndexForward: true,
      ConsistentRead: false,
      KeyConditionExpression: `#bef90 = :bef90 and begins_with(#bef91,:bef91)`,
      ExpressionAttributeValues: {
        ":bef90": pk,
        ":bef91": `notif#invoice#`,
      },
      ExpressionAttributeNames: {
        "#bef90": "pk",
        "#bef91": "sk",
      },
    };
    return dynamoDB.query(queryParams).promise();
  }

  public updateAllBlockAlertbyViewed(pk: string, sk: string) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: pk,
          sk: sk,
        },
        UpdateExpression: "SET notifViewed = :update",
        ConditionExpression: "notifViewed = :notifViewed and sk = :sk",
        ExpressionAttributeValues: {
          ":notifViewed": false,
          ":update": true,
          ":sk": sk,
        },
      })
      .promise();
  }

  public updateBlockAlertbyDismiss(
    pk: string,
    sk: string,
    currentTime: number
  ) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: pk,
          sk: sk,
        },
        UpdateExpression: "SET notifDismiss = :update, expDate= :expDate",
        ConditionExpression:
          "notifDismiss = :notifDismiss and sk = :sk and notifType = :notifType",
        ExpressionAttributeValues: {
          ":notifDismiss": false,
          ":update": true,
          ":expDate": currentTime,
          ":sk": sk,
          ":notifType": "block",
        },
      })
      .promise();
  }

  public updateAllBlockAlertbyDismiss(
    pk: string,
    sk: string,
    currentTime: number
  ) {
    return dynamoDB
      .update({
        TableName: TableName,
        Key: {
          pk: pk,
          sk: sk,
        },
        UpdateExpression:
          "SET notifDismiss = :updateNotifDismiss, expDate= :expDate",
        ConditionExpression:
          "notifDismiss = :notifDismiss and sk = :sk and notifType = :type",
        ExpressionAttributeValues: {
          ":notifDismiss": false,
          ":updateNotifDismiss": true,
          ":expDate": currentTime,
          ":sk": sk,
          ":type": "block",
        },
      })
      .promise();
  }

  public async sendNotification(params: NotificationWSObject) {
    const WebSocket = new AWS.ApiGatewayManagementApi({
      endpoint: process.env.WEB_SOCKET_END_POINT,
    });
    const { connectionId, data } = params;
    return await WebSocket.postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(data),
    }).promise();
  }
}
