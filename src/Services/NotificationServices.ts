import SqsQueueServices from "./SqsQueueServices";


export default class NotificationServices {
  
    /**
        * sendBlockAcceptedMessage
    */
    public async sendBlockAcceptedMessage(data : any) {
        const msgData = {
            type: "text_message",
            data: {
                phoneNumber : data?.user?.userPhoneNumber, 
                message: `
                    Dear ${data?.user?.userName},
                    BLOCK ACCEPTED:
                    ${data.blockInfo}
                `
            }
        }
        return new SqsQueueServices().sendMessageInNotificationQueue(msgData);
    }

}