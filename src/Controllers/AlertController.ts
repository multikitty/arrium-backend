import AWS from "aws-sdk";
import { Request, Response } from "express";
import AlertServices from "../Services/AlertServices";

export default class AlertController {
  public async insertBlockNotification(req: any, res: any) {
    const currentTime = Date.now();
    console.log({
      pk: req.body.pk,
      currentTime: currentTime,
      notifType: "block",
      price: req.body.price,
      bStartTimeU: req.body.blockStartDate,
      bEndTimeU: req.body.blockEndDate,
      stationCode: req.body.stationCode,
      stationName: req.body.stationName,
      sessionTimeU: req.body.sessionTime,
      notifDismiss: false,
      notifViewed: false,
      offerID: req.body.offerID,
    });
    await new AlertServices()
      .insertBlockAlert({
        pk: req.body.pk,
        currentTime: currentTime,
        notifType: "block",
        price: req.body.price,
        bStartTimeU: req.body.blockStartDate,
        bEndTimeU: req.body.blockEndDate,
        stationCode: req.body.stationCode,
        stationName: req.body.stationName,
        sessionTimeU: req.body.sessionTime,
        notifDismiss: false,
        notifViewed: false,
        offerID: req.body.offerID,
      })
      .then(async (result: any) => {
        const connectionData = await new AlertServices()
          .getConnectionId(req.body.pk)
          .then((result) => {
            return result.Items;
          });
        connectionData?.map(async (item: any) => {
          return await new AlertServices()
            .sendNotification({
              connectionId: item.connectionId,
              data: {
                pk: req.body.pk,
                sk: `notif#block#${currentTime}#${req.body.offerID}`,
                currentTime: Date.now(),
                notifType: "block",
                price: req.body.price,
                bStartTimeU: req.body.blockStartDate,
                bEndTimeU: req.body.blockEndDate,
                stationCode: req.body.stationCode,
                stationName: req.body.stationName,
                sessionTimeU: req.body.sessionTime,
                notifDismiss: false,
                notifViewed: false,
                offerID: req.body.offerID,
              },
            })
            .then((result: any) => {
              return {
                success: true,
                message: "Send sucessfully!",
                data: result,
              };
            })
            .catch((error: any) => {
              return {
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: error,
              };
            });
        });
        res.status(200);
        res.send({
          success: true,
          message: "Block notification added successfully!",
          data: result,
        });
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async getNotificationList(req: any, res: any) {
    console.log(req.body.pk);
    await new AlertServices()
      .getBlockNotification(req.body.pk)
      .then((result: any) => {
        res.status(200);
        res.send({
          success: true,
          message: "Block notifications!",
          data: result.Items,
        });
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async getAllNotificationList(req: any, res: any) {
    try {
      const blockNotification = await new AlertServices().getBlockNotification(
        req.params.pk
      );
      const invoiceNotification =
        await new AlertServices().getInvoiceNotification(req.params.pk);
      res.status(200);
      res.send({
        success: true,
        message: "All notifications!",
        blockNotificationData: blockNotification.Items,
        invoiceNotificationData: invoiceNotification.Items,
      });
    } catch (e) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: e,
      });
    }
  }

  async createInvoice(req: any, res: any) {
    await new AlertServices()
      .insertPaymentAlert({
        pk: req.body.pk,
        currentTime: req.body.currentTime,
        notifType: "invoice",
        invID: req.body.inv_num,
        notifViewed: false,
      })
      .then((result: any) => {
        res.status(200);
        res.send({
          success: true,
          message: " notification added successfully!",
          data: result,
        });
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  async updateInvoice(req: any, res: any) {
    const currentTime = Date.now();
    await new AlertServices()
      .updatePaymentAlert(req.body.pk, req.body.sk, currentTime)
      .then((result: any) => {
        res.status(200);
        res.send({
          success: true,
          message: " notification updated successfully!",
          data: result,
        });
      })
      .catch(function (error) {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async updateNotificationViewed(req: any, res: any) {
    const allBlockAlertOfUser = await new AlertServices().getBlockNotification(
      req.body.pk
    );
    const allInvoiceAlertOfUser =
      await new AlertServices().getInvoiceNotification(req.body.pk);
    Promise.all<any>(
      [
        ...(<[]>allBlockAlertOfUser.Items),
        ...(<[]>allInvoiceAlertOfUser.Items),
      ]?.map(async (item: any) => {
        return new AlertServices()
          .updateAllBlockAlertbyViewed(item.pk, item.sk)
          .then((result: any) => {
            return {
              success: true,
              message: "Update sucessfully!",
              data: result,
            };
          })
          .catch((e: any) => {
            return {
              success: false,
              message: "Something went wrong, please try after sometime.",
              error: e,
            };
          });
      })
    )
      .then(function (result) {
        res.status(200);
        res.send({
          success: true,
          message: "All notification viewed successfully!",
          data: result,
        });
      })
      .catch(function (error) {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async updateDismissedDateInAllBlockNotification(req: any, res: any) {
    const allBlockAlertOfUser = await new AlertServices().getBlockNotification(
      req.body.pk
    );
    const currentTime = Date.now();
    Promise.all<any>(
      allBlockAlertOfUser.Items?.map(async (item: any) => {
        return new AlertServices()
          .updateAllBlockAlertbyDismiss(item.pk, item.sk, currentTime)
          .then((result: any) => {
            return {
              success: true,
              message: "Update sucessfully!",
              data: result,
            };
          })
          .catch((e: any) => {
            return {
              success: false,
              message: "Something went wrong, please try after sometime.",
              error: e,
            };
          });
      })
    )
      .then(function (result) {
        res.status(200);
        res.send({
          success: true,
          message: "All notification dismissed successfully!",
          data: result,
        });
      })
      .catch(function (error) {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async updateDismissedDateInBlockNotification(req: any, res: any) {
    const currentTime = Date.now();
    await new AlertServices()
      .updateBlockAlertbyDismiss(req.body.pk, req.body.sk, currentTime)
      .then((result: any) => {
        res.status(200);
        res.send({
          success: true,
          message: "All notification viewed successfully!",
          data: result,
        });
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  public async sendNotificationWS(req: any, res: any) {
    const connectionData = await new AlertServices()
      .getConnectionId(req.params.pk)
      .then((result) => {
        return result.Items;
      });
    Promise.all<any>(
      connectionData?.map(async (item: any) => {
        return await new AlertServices()
          .sendNotification({
            connectionId: item.connectionId,
            data: req.body.data,
          })
          .then((result: any) => {
            res.status(200);
            res.send({
              success: true,
              message: "Send sucessfully!",
              data: result,
            });
          })
          .catch((error: any) => {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
              error: error,
            });
          });
      })
    );
  }
}
