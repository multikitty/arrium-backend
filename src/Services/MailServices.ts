import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME, // generated ethereal user
    pass: process.env.MAIL_PASSWORD, // generated ethereal password
  },
});

export class mailServices {
  async sendMailEmailVerification(data: any) {
    return transporter.sendMail({
      from: '"Arrium" <devscaleupally@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "You signup successfully, please verify your email", // Subject line
      text: "Please follow the below link to verify your email address", // plain text body
      html: `<p>Please follow the below link to verify your email address</p><br /><p>https://arrium.io/signupEmailVerify?token=${data.token}</p>`,
    });
  }

  async sendMailForgotPassword(data: any) {
    return transporter.sendMail({
      from: '"Arrium Testing" <devscaleupally@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "Forget Password reset link", // Subject line
      text: "Please follow the below link to reset your password", // plain text body
      html: `<p>Please follow the below link to reset your password</p><br /><p>https://arrium.io/reset-password?token=${data.token}</p>`,
    });
  }
}

export default new mailServices();
