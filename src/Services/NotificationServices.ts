import SqsQueueServices from "./SqsQueueServices";

export default class NotificationServices {
  /**
   * sendBlockAcceptedMessage
   */
  public async sendBlockAcceptedMessage(data: any) {
    const msgData = {
      type: "text_message",
      data: {
        phoneNumber: data?.user?.userPhoneNumber,
        message: `BLOCK(S) ACCEPTED\n\n${data.blockInfo}`,
      },
    };
    return await new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }

  /**
   * sendOTP
   */
  public async sendOTPSMS(data: any) {
    const msgData = {
      type: "text_message",
      data: {
        phoneNumber: data?.userPhoneNumber,
        message: `Here is your OTP: ${data.otp}`,
      },
    };
    return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
  }
}
