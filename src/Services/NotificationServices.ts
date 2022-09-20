
import  AWS from "aws-sdk";


export default class NotificationServices {
  

    /**
        * sendBlockAcceptedMessage
    */
    public async sendBlockAcceptedMessage(data : any) {
        let message = `
            Dear ${data.user.userName ?? "Dipanshu"},
            BLOCK ACCEPTED:
            ${data.blockInfo}
        `;
        return new AWS.SNS({region: 'eu-west-1'}).publish({
            Message : message,
            PhoneNumber : data?.user?.userPhoneNumber
        }).promise()
    }



}