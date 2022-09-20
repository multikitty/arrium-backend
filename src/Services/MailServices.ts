import nodemailer from "nodemailer";
import  AWS from "aws-sdk";

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
    return transporter.sendMail({
      from: '"Arrium" <devscaleupally@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "Your account has been created successfully, please verify your email.", // Subject line
      text: "Please follow the below link to verify your email address.", // plain text body
      html: `<p>Please follow the below link to verify your email address</p><br /><p>https://arrium.io/signupEmailVerify?token=${data.token}</p>`,
    });
  }

  async sendMailForgotPassword(data: any) {
    return transporter.sendMail({
      from: '"Arrium Testing" <devscaleupally@gmail.com>', // sender address
      to: data.pkEmail, // list of receivers
      subject: "Forget Password reset link", // Subject line
      text: "Please follow the below link to reset your password", // plain text body
      html: `<p>Please follow the below link to reset your password</p><br /><p>https://arrium.io/reset-password?token=${data.token}</p>`,
    });
  }


  /**
   * sendBlockAcceptedMail
   */
  public sendBlockAcceptedMail(data : any) {
    let params = {
      Source: 'notification@arrium.io',
      Destination: {
        ToAddresses: [
          data.user.userEmail
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
            Dear ${data.user.userName},
            The following block(s) have been accepted:
            ${data.blockInfo} 
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Block(s) Accepted`,
        }
      },
    };
    return new AWS.SES({region : "eu-west-1"}).sendEmail(params).promise();
  }
}
