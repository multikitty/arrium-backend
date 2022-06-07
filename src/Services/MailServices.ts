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

export const mailServices = {
  emailConfirmation: async () => {
    // send mail with defined transport object
    transporter
      .sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "gdkemktvxzwdvnurao@nthrl.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      })
      .then((result) => {
        //   console.log("Message sent: %s", result.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview only available when sending through an Ethereal account
        //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      })
      .catch((error) => {
        console.log("Oops getting error while sending mail", error);
      });
  },

  sendMailEmailVerification: async (data: any) => {
    return transporter.sendMail({
      from: '"Arrium" <devscaleupally@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "You signup successfully, please verify your email", // Subject line
      text: "Please follow the below link to verify your email address", // plain text body
      html: `<p>Please follow the below link to verify your email address</p><br /><p>http://localhost:8001/signupEmailVerify?token=${data.token}</p>`,
    });
  },

  sendMailForgotPassword: async (data: any) => {
    return transporter.sendMail({
      from: '"Arrium Testing" <devscaleupally@gmail.com>', // sender address
      to: data.email, // list of receivers
      subject: "Forget Password reset link", // Subject line
      text: "Please follow the below link to reset your password", // plain text body
      html: `<p>Please follow the below link to reset your password</p><br /><p>http://localhost:8001/resetPassword?token=${data.token}</p>`,
    });
  },
};
