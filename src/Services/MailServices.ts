import nodemailer from "nodemailer";
import  AWS from "aws-sdk";
import SqsQueueServices from "./SqsQueueServices";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

export default class MailServices {
  async sendMailEmailVerification(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.email,
        from : 'noreply@arrium.io',
        replyTo : [],
        subject : `Email Verification`,
        message : `
            <p>Please follow the below link to verify your email address</p><br /><p>https://arrium.io/signupEmailVerify?token=${data.token}</p>
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async sendMailForgotPassword(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.pkEmail,
        from : 'noreply@arrium.io',
        replyTo : [],
        subject : "Reset Password",
        message :`
            <p>Please follow the below link to reset your password</p><br /><p>https://arrium.io/reset-password?token=${data.token}</p></br>
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  /**
   * sendBlockAcceptedMail
   */
  public sendBlockAcceptedMail(data : any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.user.userEmail,
        from : 'notification@arrium.io',
        replyTo : [],
        subject : "Block(s) Accepted",
        message : `
                Dear ${data.user.userName}, </br> 
                The following block(s) have been accepted: </br>
                ${data.blockInfo} </br>
              `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }
}
