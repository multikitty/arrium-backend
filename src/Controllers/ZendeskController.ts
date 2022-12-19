import ZendeskServices from "../Services/ZendeskServices";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { ZendeskCreateTicket } from "../Interfaces/zendeskInterface";

export default class ZendeskController {

  // upload file controller
  async uploadFile(request: any, response: any) {
    const fileName = uuidv4()
    fs.writeFileSync(`uploads/${fileName}.jpg`, request.body);
    await new ZendeskServices().uploadAttechment(fileName, fs.createReadStream(`uploads/${fileName}.jpg`)).then(async (result: any) => {
      response.status(200);
      response.send({
        success: false,
        message: "File Uploaded sucessfully!",
        result: result.upload
      });
      fs.unlinkSync(`uploads/${fileName}.jpg`);
    }).catch((error: any) => {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    })
  }

  // create Ticket controller 
  async createTicket(request: any, response: any) {
    try {
      let params: ZendeskCreateTicket = {
        created_at: Date.now(),
        comment: {
          uploads: [
            request.body.uploadToken
          ]
        },
        description: request.body.message,
        raw_subject: "",
        recipient: request.body.zendeskUserEmail,
        subject: request.body.subject,
        priority: "normal",
        status: "new",
        submitter_id: request.body.zendeskUserId,
        type: "incident"
      }

      await new ZendeskServices().createSupportTicket(params).then(async (result: any) => {
        response.status(200);
        response.send({
          success: false,
          message: "Ticket created sucessfully!",
        });
      }).catch((error: any) => {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error
        });
      })
    } catch (error) {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    }
  }

}