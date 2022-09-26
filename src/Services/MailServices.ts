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
    let params = {
      Source: 'noreply@arrium.io',
      Destination: {
        ToAddresses: [
          data.email
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <p>Please follow the below link to verify your email address</p><br /><p>https://arrium.io/signupEmailVerify?token=${data.token}</p>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Email verification.`,
        }
      },
    };
    return new AWS.SES({region : "eu-west-1"}).sendEmail(params).promise();
  }

  async sendMailForgotPassword(data: any) {
    let params = {
      Source: 'noreply@arrium.io',
      Destination: {
        ToAddresses: [
          data.pkEmail
        ],
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <p>Please follow the below link to reset your password</p><br /><p>https://arrium.io/reset-password?token=${data.token}</p></br>
            `,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Password reset link.`,
        }
      },
    };
    return new AWS.SES({region : "eu-west-1"}).sendEmail(params).promise();
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
            The following block(s) have been accepted: </br>
            ${data.blockInfo} </br>
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
