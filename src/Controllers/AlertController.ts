import AWS from "aws-sdk";
import { Request, Response } from "express";
import AlertServices from "../Services/AlertServices";

export default class AlertController {
  async insertNotification(request: Request, response: Response) {
    const { pk, invoice_id } = request.body;
    new AlertServices()
      .insertAlert({
        pk: pk,
        notificationType: "Pinned",
        invoiceId: invoice_id,
      })
      .then((result: any) => {
        console.log("Result", result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async updateNotification(request: any, response: any) {
    new AlertServices()
      .updateAlert({
        pk: "UK-900043",
        invoiceId: "001",
        currentTime: 1671978034604,
      })
      .then((result: any) => {
        console.log("Result", result);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async sendNotificationData(request: Request, response: Response) {
    const { connectionId, data } = request.body;
    await new AlertServices()
      .sendNotification({
        connectionId: connectionId,
        message: JSON.stringify(data),
      })
      .then((result: any) => {
        response.status(200);
        response.send({
          success: true,
          message: "Notification sent successfully.",
        });
      })
      .catch((error: any) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }
}
