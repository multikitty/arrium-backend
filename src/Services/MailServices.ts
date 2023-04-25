import SqsQueueServices from "./SqsQueueServices";
export default class MailServices {
  async newUserSignUpMail(data: any) {
    const msgData = {
      type: "mail",
      data: {
        to: "info@braincuber.com",
        from: "support@arrium.io",
        replyTo: ["support@arrium.io"],
        subject: `New Account Setup`,
        message: `
            <p>Hi Admin,</p>
            <p>A new user has provided their Amazon Flex login details at the sign-up step, and are at the 'holding page' step, awaiting account setup to be completed.</p>
            <p>Find the customer using the below details, to configure their account</p>
            <p>Full Name: ${data.firstname} ${data.lastname}</p>
            <p>Email Address:${data.email} </p>
            <p>- the Support Team at Arrium</p>
          `,
      },
    };
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async accountSetupMail(data: any) {
    const msgData = {
      type: "mail",
      data: {
        to: data.userEmail,
        from: "support@arrium.io",
        replyTo: ["support@arrium.io"],
        subject: `Arrium account is ready`,
        message: `
            <p>Hi ${data.userName}</p>
            <p>Your account is ready to start accepting offers for Amazon Flex.</p>
            <p>Click <a href="https://www.arrium.io/">here<a/> to login</p>
            <p>Or, you can copy and paste this link into a web browser: <a href="https://www.arrium.io/">insert link here<a/></p>
            <p>- the Support Team at Arrium</p>
          `,
      },
    };
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async sendMailEmailVerification(data: any) {
    const msgData = {
      type: "mail",
      data: {
        to: data.email,
        from: "support@arrium.io",
        replyTo: ["support@arrium.io"],
        subject: `Verify your email address`,
        message: `
            <p>Hi</p>
            <p>We need to verify your email address to keep your account safe.</p>
            <p>Click <a href="https://arrium.io/signupEmailVerify/?token=${data.token}">here<a/> to verify your email address.</p>
            <p>Or, you can copy and paste this link into a web browser: <a href="https://arrium.io/signupEmailVerify">insert link here<a/></p>
            <p>- the Support Team at Arrium</p>
          `,
      },
    };
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async sendMailForgotPassword(data: any) {
    const msgData = {
      type: "mail",
      data: {
        to: data.email,
        from: "support@arrium.io",
        replyTo: ["support@arrium.io"],
        subject: "Password Reset",
        message: `
            <p>Hi ${data.firstname} ${data.lastname}</p>
            <p>We’ve received a request to reset your password.</p>
            <p>Click <a href="https://arrium.io/reset-password/?token=${data.token}">here<a/> to reset your password.</p>
            <p>Or, you can copy and paste this link into a web browser: <a href="https://arrium.io/reset-password">insert link here<a/></p>
            <p>If you did not initiate this request, please contact us immediately at <a href="mailto:support@arrium.io">support@arrium.io<a/></p>
            <p>- the Support Team at Arrium</p>
          `,
      },
    };
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  /**
   * sendBlockAcceptedMail
   */
  public async sendBlockAcceptedMail(data: any) {
    const msgData = {
      type: "mail",
      data: {
        to: data.user.userEmail,
        from: "support@arrium.io",
        replyTo: ["support@arrium.io"],
        subject: "Offer(s) Accepted",
        message: `
          <p>Hi ${data.user.userName}</p>
          <p>Arrium has accepted the following offer(s) for you.</p>
          ${data.blockInfo}
          <p>Drive safely.</p>
          <p>- the Support Team at Arrium</p>
        `,
      },
    };
    return await new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }
}
