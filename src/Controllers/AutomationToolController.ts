import { Request, Response } from 'express';
import UserServices from '../Services/UserServices';
import PreferenceServices from '../Services/PreferenceServices';
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
export default class AutomationToolController {

  /**
      * fetchFlexAndPreferences
      */
  public async fetchFlexAndPreferences(req: Request, res: Response) {
    await new UserServices().fetchAmznFlexDetails(req.body).then(async (result: any) => {
      if (result.Item) {
        // here verify AWS verification flag              
        let responseData = {
          flexDetails: result.Item,
          preferences: []
        }
        await new PreferenceServices().getPreferenceByUser(req.body.pk)
          .then((result: any) => {
            if (result.Items) {
              responseData.preferences = result.Items
              res.status(200);
              res.send({
                success: true,
                message: "Details fetched successfully.",
                data: responseData
              });
            }
          }).catch((err: any) => {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
              error: err
            });
          });
      }
    }).catch((error) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error: error
      });
    });
  }

  public creactAutomationSchedule(req: Request, res: Response) {

    const functionName = 'Eventbridge-rule-creation-trigger';
    const payload = JSON.stringify({ message: 'Hello, World!' });
    const params = {
      FunctionName: functionName,
      Payload: payload
    };
    lambda.invoke(params, function (err: { stack: any; }, data: { Payload: { toString: () => any; }; }) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data.Payload.toString());
      }
    });

    res.status(500);
    res.send({
      success: false,
      message: "Something went wrong, please try after sometime.",
    });
  }
}