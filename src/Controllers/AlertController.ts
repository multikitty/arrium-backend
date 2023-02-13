import AWS from "aws-sdk"
import AlertServices from "../Services/AlertServices"


export default class AlertController{

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
        }).then((result:any)=>{
          res.status(200);
          res.send({
             success: true,
             message: "Block notification added successfully!",
             data: result,
          });
        }).catch((error:any)=>{
          res.status(500);
          res.send({
             success: false,
             message: "Something went wrong, please try after sometime.",
             error: error
          });
        })
      }

      public async getNotificationList(req: any, res: any){
        console.log(req.body.pk)
        await new AlertServices().getBlockNotification(req.body.pk).then((result:any)=>{
          res.status(200);
          res.send({
             success: true,
             message: "Block notifications!",
             data: result.Items ,
          });
        }).catch((error:any)=>{
          res.status(500);
          res.send({
             success: false,
             message: "Something went wrong, please try after sometime.",
             error: error
          });
        })
      }

      async updateNotificationViewed(req: any, res: any) {
       await new AlertServices().updateAllBlockAlertbyViewed(req.body.pk).then((result:any)=>{
          res.status(200);
          res.send({
             success: true,
             message: "Update sucessfully!",
             data: result,
          });
      }).catch((error:any)=>{
        res.status(500);
        res.send({
           success: false,
           message: "Something went wrong, please try after sometime.",
           error: error
        });
      })
    }

    async updateDismissedDateInAllBlockNotification(req: any, res: any) {
     const currentTime = Math.floor(Date.now() / 1000);
     await new AlertServices().updateAllBlockAlertbyDismiss(req.body.pk, currentTime).then((result:any)=>{
        res.status(200);
        res.send({
           success: true,
           message: "Update sucessfully!",
           data: result,
        });
    }).catch((error:any)=>{
      res.status(500);
      res.send({
         success: false,
         message: "Something went wrong, please try after sometime.",
         error: error
      });
    })
  }

  async updateDismissedDateInBlockNotification(req: any, res: any) {
    const currentTime = Math.floor(Date.now() / 1000);
    await new AlertServices().updateBlockAlertbyDismiss(req.body.pk,req.body.sk, currentTime).then((result:any)=>{
       res.status(200);
       res.send({
          success: true,
          message: "Update sucessfully!",
          data: result,
       });
   }).catch((error:any)=>{
     res.status(500);
     res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
     });
   })
 }
}