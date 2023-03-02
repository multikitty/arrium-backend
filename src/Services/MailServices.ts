import SqsQueueServices from "./SqsQueueServices";
export default class MailServices {
  
  async newUserSignUpMail(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : 'dipanshu.jaiswal@scaleupally.io',
        from : 'notification@arrium.io',
        replyTo : [],
        subject : `Approve new user account.`,
        message : `
          Dear Admin,
          A new user has provided their Amazon Flex login details at the sign up step, and are at the 'holding page' step, awaiting account setup to be completed.
          <br/>Full Name: ${data.firstname} ${data.lastname}
          <br/>Email Address: ${data.email}
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async accountSetupMail(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.userEmail,
        from : 'notification@arrium.io',
        replyTo : [],
        subject : `Account Configured`,
        message : `
            Dear ${data.userName}, <br/>
            Your account has been configured and you can begin using Arrium to start booking your blocks with Amazon Flex.
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async sendMailEmailVerification(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.email,
        from : 'noreply@arrium.io',
        replyTo : [],
        subject : `Email Verification`,
        message : `
            <p>Please follow the below link to verify your email address</p><br /><p>https://arrium.io/signupEmailVerify/?token=${data.token}</p>
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  async sendMailForgotPassword(data: any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.email,
        from : 'noreply@arrium.io',
        replyTo : [],
        subject : "Reset Password",
        message :`
            <p>Please follow the below link to reset your password</p><br /><p>https://arrium.io/reset-password/?token=${data.token}</p></br>
          `
      }
    }
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  /**
   * sendBlockAcceptedMail
   */
  public async sendBlockAcceptedMail(data : any) {
    const msgData = {
      type : "mail",
      data : {
        to : data.user.userEmail,
        from : 'notification@arrium.io',
        replyTo : [],
        subject : "Block(s) Accepted",
        message : `Dear ${data.user.userName},<br />
        The following block(s) have been accepted:<br/><br/>
        ${data.blockInfo}`
      }
    }
    return await new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }
}
