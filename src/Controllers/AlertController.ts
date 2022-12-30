import AWS from "aws-sdk"
import AlertServices from "../Services/AlertServices"


export default class AlertController{
     async insertNotification(request: any, response: any) {
      new AlertServices().insertAlert({
        pk: "UK-900043",
        notificationType: "Pinned",
        invoiceId: "001"
      }).then((result:any)=>{
          console.log("Result",result)
      }).catch((error:any)=>{
          console.log(error)
      })
      }

      async updateNotification(request: any, response: any) {
        new AlertServices().updateAlert({
          pk: "UK-900043",
          invoiceId: "001",
          currentTime:1671978034604
        }).then((result:any)=>{
          console.log("Result",result)
      }).catch((error:any)=>{
          console.log(error)
      })
    }
}