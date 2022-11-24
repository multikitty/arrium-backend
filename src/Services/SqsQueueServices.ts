
import  AWS from "aws-sdk";
import { SQSNotificationParams } from "../Interfaces/SQSInterface";

export default class SqsQueueServices {
    /**
        * sendMessageInNotificationQueue
    */
    public async sendMessageInNotificationQueue(data : SQSNotificationParams) {
        const sqs = new AWS.SQS({apiVersion: '2012-11-05', region : "eu-west-1"});
        const params = {
            MessageBody: JSON.stringify({
                type: data.type,
                data: data.data
            }),
            QueueUrl : process?.env?.NOTIFICATION_QUEUE_URL ?? ""
        }
        // send data to SQS
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                return true
              console.log("Error", err);
            } else {
                return false
              console.log("Successfully added message", data.MessageId);
            }
        });
    }

}
