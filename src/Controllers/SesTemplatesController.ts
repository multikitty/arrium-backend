import { Request, Response } from "express";
import AWS from "aws-sdk"


export default class SesTemplatesController {
    
    /**
        * createEmailTemplate
        */
    public async createEmailTemplate(req: Request, res: Response) {
        const ses = new AWS.SES();
        const parameters = {
            Template: {
                TemplateName: 'AmazonSESTemplate',
                HtmlPart: ``,
                SubjectPart: 'SES Template',
    
            },
        };
        return await ses.createTemplate(parameters).promise()

    }
}