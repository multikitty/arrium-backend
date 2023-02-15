import AWS from "aws-sdk";
import { Request, Response } from "express";
import AlertServices from "../Services/AlertServices";


export default class AlertController {

  public async insertBlockNotification(req: any, res: any) {
    console.log({
      pk: req.body.pk,
      currentTime: Date.now(),
      notifType: 'block',
      price: req.body.price,
      bStartTimeU: req.body.blockStartDate,
      bEndTimeU: req.body.blockEndDate,
      stationCode: req.body.stationCode,
      stationName: req.body.stationName,
      sessionTimeU: req.body.sessionTime,
      notifDismiss: false,
      notifViewed: false,
      offerID: req.body.offerID
    })
    await new AlertServices().insertBlockAlert({
      pk: req.body.pk,
      currentTime: Date.now(),
      notifType: 'block',
      price: req.body.price,
      bStartTimeU: req.body.blockStartDate,
      bEndTimeU: req.body.blockEndDate,
      stationCode: req.body.stationCode,
      stationName: req.body.stationName,
      sessionTimeU: req.body.sessionTime,
      notifDismiss: false,
      notifViewed: false,
      offerID: req.body.offerID
    }).then((result: any) => {
      res.status(200);
      res.send({
        success: true,
        message: "Block notification added successfully!",
        data: result,
      });
    }).catch((error: any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    })
  }

  public async getNotificationList(req: any, res: any) {
    console.log(req.body.pk)
    await new AlertServices().getBlockNotification(req.body.pk).then((result: any) => {
      res.status(200);
      res.send({
        success: true,
        message: "Block notifications!",
        data: result.Items,
      });
    }).catch((error: any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    })
  }

  public async getAllNotificationList(req: any, res: any) {
    console.log(req.params.pk)
    try {
      const blockNotification: any = await new AlertServices().getBlockNotification(req.body.pk)
      const invoiceNotification: any = await new AlertServices().getInvoiceNotification(req.body.pk)
      res.status(200);
      res.send({
        success: true,
        message: "All notifications!",
        data: invoiceNotification.Items?.concat(blockNotification.Items),
      });
    } catch (e) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: e
      });
    }
  }

  async updateNotificationViewed(req: any, res: any) {
    const allBlockAlertOfUser = await new AlertServices().getBlockNotification(req.body.pk)
    Promise.all<any>(allBlockAlertOfUser.Items?.map(async (item: any) => {
      return new AlertServices().updateAllBlockAlertbyViewed(item.pk, item.sk).then((result: any) => {
        return {
          success: true,
          message: "Update sucessfully!",
          data: result,
        }
      }).catch((e: any) => {
        return {
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: e
        }
      })
    })).then(function (result) {
      res.status(200);
      res.send({
        success: true,
        message: "All notification viewed successfully!",
        data: result,
      });
    }).catch(function (error) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    });
  }

  async updateDismissedDateInAllBlockNotification(req: any, res: any) {
    const allBlockAlertOfUser = await new AlertServices().getBlockNotification(req.body.pk)
    const currentTime = Math.floor(Date.now() / 1000);
    Promise.all<any>(allBlockAlertOfUser.Items?.map(async (item: any) => {
      return new AlertServices().updateAllBlockAlertbyDismiss(item.pk, item.sk, currentTime).then((result: any) => {
        return {
          success: true,
          message: "Update sucessfully!",
          data: result,
        }
      }).catch((e: any) => {
        return {
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: e
        }
      })
    })).then(function (result) {
      res.status(200);
      res.send({
        success: true,
        message: "All notification viewed successfully!",
        data: result,
      });
    }).catch(function (error) {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    });
  }

  async updateDismissedDateInBlockNotification(req: any, res: any) {
    const currentTime = Math.floor(Date.now() / 1000);
    await new AlertServices().updateBlockAlertbyDismiss(req.body.pk, req.body.sk, currentTime).then((result: any) => {
      res.status(200);
      res.send({
        success: true,
        message: "Update sucessfully!",
        data: result,
      });
    }).catch((error: any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    })
  }
}
