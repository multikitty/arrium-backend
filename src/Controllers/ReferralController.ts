import { Request, Response } from "express";
import { ReferralCodeObj, ReferralRequestData } from "../Interfaces/referralInterface";
import fs from 'fs';
import initialIds from '../Utils/customerId.json';
import CommonServices from "../Services/CommonServices";
import ReferralServices from "../Services/ReferralServices";
import UserServices from "../Services/UserServices";
export default class ReferralController {

    /**
        * createReferralCode
        */
    public createReferralCode(req: Request, res: Response) {
        // request data
        let referralData: ReferralRequestData = {
            country: req.body.country,
            region: req.body.region,
            station: req.body.station,
            numberOfReferral: Number(req.body.numberOfReferral),
            assignTo: req.body.assignTo
        }
        // Batch insert
        let batchSize = 25;
        let batchItemsList: any[] = [];
        let failedItems: any[] = []
        // loop for creating referral codes
        for (let i = 0; i < referralData.numberOfReferral; i++) {
            // For Generating referral code
            new UserServices().generateRandomCustomerID(req.body.country).then(async (cID) => {
                if(cID) {
                    let customerID = String(cID);
                    // Create block item object
                    let codeData: ReferralCodeObj = {
                        sk: `referral#${customerID}`,
                        pk: 'referral',
                        refCode: customerID,
                        customerID: customerID,
                        country: referralData.country,
                        region: referralData.region,
                        station: referralData.station,
                        refGenFor: referralData.assignTo,
                        refGenBy: req.body.pk,
                        refGen: new Date().toISOString(),
                        refActive: true
                    }
                    // store in query format
                    let batchItem = {
                        PutRequest: {
                            Item: codeData
                        },
                    };
                    // add block item in array
                    batchItemsList.push(batchItem)
                    // insert records
                    if (batchItemsList.length === batchSize || i + 1 === referralData.numberOfReferral) {
                        // execute batch write operation
                        await new CommonServices().batchWriteData(batchItemsList).then(async (result: any) => {
                            batchItemsList = [] // clear batchItemsList
                            // store unprocessed (failed items)
                            failedItems.push(result.UnprocessedItems)
                            if (i + 1 === referralData.numberOfReferral) {
                                res.status(200);
                                res.send({
                                    success: true,
                                    message: "Referral codes created successfully.",
                                    data: failedItems
                                });
                            }
                        }).catch((error: any) => {
                            res.status(500);
                            res.send({
                                success: false,
                                message: "Something went wrong, please try after sometime.",
                                error: error
                            });
                        })
                    }
                } else {
                  res.status(500);
                  res.send({
                    success: false,
                    message: 'Something went wrong, please try after sometime.'
                  });
                }
              }).catch((err) => {
                res.status(500);
                res.send({
                  success: false,
                  message: 'Something went wrong, please try after sometime.',
                  error: err,
                });
              })
        }
    }


    /**
    * fetchRefCodeByCreator
    */
    public async fetchRefCodeByCreator(req: Request, res: Response) {
        let userpk: any = req.query.userpk;
        await new ReferralServices().getRefGenBy(userpk).then((result: any) => {
            res.status(200);
            res.send({
                success: true,
                message: "Referral list retrieved successfully.",
                data: result,
            });
        }).catch((err) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: err
            });
        });
    }

    /**
   * fetchRefCodeByCreator
   */
    public async fetchRefCodeByAgent(req: Request, res: Response) {
        let userpk: any = req.query.userpk;
        await new ReferralServices().getRefGenFor(userpk).then((result: any) => {
            res.status(200);
            res.send({
                success: true,
                message: "Referral list retrieved successfully.",
                data: result,
            });
        }).catch((err) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: err
            });
        });
    }
}