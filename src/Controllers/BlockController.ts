const _ = require('underscore');
const axios = require('axios');

import  moment from "moment";
import NotificationServices from "../Services/NotificationServices";
import BlockServices from "../Services/BlocksServices";
import MailServices from "../Services/MailServices";
import UserServices from "../Services/UserServices";
import CommonServices from "../Services/CommonServices";
import { Request, response, Response } from "express";
export default class BlockController {
 
  /**
    * send notification
    */
  private async sendAcceptedBlockNotification (data : any) {
    let blockInfo = ``;
    let validBlockInfo = false;
    // loop through block list
    for (let i = 0; i < data.blockInfo.length; i++) {
      const block = data.blockInfo[i];
      // get block date and day
      let blockDate = new Date(block.bStartTime * 1000);
      let newBlockDate = blockDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric'});
      let blockDay = new Intl.DateTimeFormat('en-US', {weekday: "short"}).format(blockDate)
      // get start time
      let startDateTime = new Date(block.bStartTime * 1000);
      let startTime = startDateTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
      // get end time
      let endDateTime = new Date(block.bEndTime * 1000);
      let endTime = endDateTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
      blockInfo += `
      ${blockDay} ${newBlockDate} ${block.stationName}(${block.stationCode}) ${startTime} - ${endTime} ${block.price} ${block.currency} 
      `;
      if(data.blockInfo.length === i+1) {
        validBlockInfo = true;
      } 
    }
    // send notification messages in queue
    if(validBlockInfo) {
      new MailServices().sendBlockAcceptedMail({blockInfo : blockInfo, user : data.user})
      new NotificationServices().sendBlockAcceptedMessage({blockInfo : blockInfo, user : data.user})
    }
  }
  /**
    * addBlocks
    */
  public async addBlocks(request: any, response: any) {
    let batchNumber = 1;
    let userDetails = null;
    let blockList = request.body.blockItems;
    
    // fetch user details
    await new UserServices().getUserData(request.body).then((result) => {
      if (result.Item) {
        // Set user details
        userDetails = {
          userName : result.Item.firstname+ " " +result.Item.lastname,
          userEmail : result.Item.email,
          userPhoneNumber : result.Item.dialCode+""+result.Item.phoneNumber
        }
        
        // Filter block by status
        let blocksByStatus = _.groupBy(blockList, 'status')
        // accepted block
        let acceptedBlocks = blocksByStatus?.Accepted
        // Group blocks by accepted timestamp
        let blocksGroup =  _.groupBy(acceptedBlocks, 'acceptedAt')
        // iterate through block groups and send notification
        for (const key in blocksGroup) {
          if (Object.prototype.hasOwnProperty.call(blocksGroup, key)) {
            const block = blocksGroup[key];
            this.sendAcceptedBlockNotification({blockInfo : block, user : userDetails})
          }
        }
        
        // Get current batch number
        new BlockServices().getBatchNumber(request.body.pk).then( async (result : any) => {
          // generate new batch number
          if(result.Item) {
            let newBatchNumber = result.Item.batch + 1;
            batchNumber = newBatchNumber;
          } 
          // Start adding blocks
          let blockList = request.body.blockItems;
          let batchSize = 25;
          let batchItemsList = [];
          let allBlocksData : any[] = [];
          let failedItems : any[] = []
          // loop through block list
          for (let i = 0; i < blockList.length; i++) {
            const block = blockList[i];
            // get block date and day
            let blockDate = new Date(block.bStartTime * 1000);
            let bDate = blockDate.toISOString().split('T')[0] // for Sort key value
            let newBlockDate = blockDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric'});
            let blockDay = new Intl.DateTimeFormat('en-US', {weekday: "short"}).format(blockDate)
            // get start time
            let startDateTime = new Date(block.bStartTime * 1000);
            let startTime = startDateTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
            // get end time
            let endDateTime = new Date(block.bEndTime * 1000);
            let endTime = endDateTime.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })
            // calculate duration
            let now = moment(startDateTime); 
            let end = moment(endDateTime);
            let difference = moment.duration(end.diff(now));
            let duration : string = String((difference.asHours()).toFixed(2));
            duration = `${duration} Hours`;
            // create sort key for block
            let blockSk = `block#${batchNumber}#${bDate}#${block.bStartTime}#${block.bEndTime}#${block.offerId}`;
            // Create block item object
            let blockItem = {
              PutRequest: {
                Item: {
                  pk: request.body.pk,
                  sk: blockSk,
                  bDay: blockDay,
                  bDate: newBlockDate,
                  Status: block.status,
                  duration: duration,
                  price: block.price,
                  bStartTime: startTime,
                  bEndTime: endTime,
                  stationCode: block.stationCode,
                  stationName: block.stationName,
                  currency: block.currency,
                  offerID: block.offerId,
                  surgeMultiplier: block.surgeMultiplier,
                  projectedTips: block.projectedTips,
                  priorityOffer: block.priorityOffer,
                  expDate: block.bEndTime
                },
              },
            };
            // add block items to all block data array
            let blockData = {
              pk: request.body.pk,
              sk: blockSk,
              bDay: blockDay,
              bDate: newBlockDate,
              Status: block.status,
              duration: duration,
              price: block.price,
              bStartTime: startTime,
              bEndTime: endTime,
              stationCode: block.stationCode,
              stationName: block.stationName,
              currency: block.currency,
              offerID: block.offerId,
              surgeMultiplier: block.surgeMultiplier,
              projectedTips: block.projectedTips,
              priorityOffer: block.priorityOffer,
              expDate: block.bEndTime
            }
            allBlocksData.push(blockData)
            // add block item in array
            batchItemsList.push(blockItem)
            if(batchItemsList.length === batchSize || i+1 === blockList.length) {
              // execute batch write operation
              await new CommonServices().batchWriteData(batchItemsList).then(async (result: any) => {
                batchItemsList = [] // clear batchItemsList
                // store unprocessed (failed items)
                failedItems.push(result.UnprocessedItems)
                if(i+1 === blockList.length) {
                  // update batch number
                  let batchInfo = {
                    userPk : request.body.pk,
                    batchNumber : batchNumber
                  }
                  // Update batch number
                  await new BlockServices().updateBatchNumber(batchInfo).then((result: any) => {
                    if(result.Attributes) {
                      // update frontend client with socket io event
                      request.app.get("socketService").emit("block-data-updated", {data : allBlocksData, userPk : request.body.pk});
                      // success response
                      response.status(200);
                      response.send({
                        success: true,
                        message: "Searched blocks added successfully.",
                        data: failedItems
                      });
                    } else {
                      response.status(500);
                      response.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                      });  
                    }
                  }).catch((error : any) => {
                    response.status(500);
                    response.send({
                      success: false,
                      message: "Something went wrong, please try after sometime.",
                      error : error
                    });  
                  })
                }
              }).catch((error : any) => {
                response.status(500);
                response.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error : error
                });  
              })
            }        
          }
        }).catch((error : any) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error : error
          });  
        });
      } else {
        response.status(500);
        response.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error : "error"
        });  
      }
    }).catch((error) => {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });  
    });

  }

  /**
    * getBlockList
    */
  public getBlockList(request: any, response: any) {
    // Get current batch number
    new BlockServices().getBatchNumber(request.body.pk).then((result : any) => {
      // generate new batch number
      if(result.Item) {
        let batchNumber = result.Item.batch;
        let batchInfo = {
          userPk : request.body.pk,
          batch : batchNumber
        }
        // fetch block list 
        new BlockServices().getBlockList(batchInfo)
        .then((result : any) => {
          response.status(200);
          response.send({
            success: true,
            message: "Searched blocks list fetched successfully.",
            data : result.Items
          });  
        }).catch((err : any) => {
          response.status(500);
          response.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error : err
          });  
        });
      } else {
        response.status(200);
        response.send({
          success: true,
          message: "No data found.",
          data : []
        });  
      }
    }).catch((error : any) => {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });  
    });
  }

  /**
    * blockSearchStart
    */
  public async blockSearchStart(req : Request, res : Response) {
    await  axios.post(`${process.env.AUTMATION_TOOL_BASE_URL}run-task/`, {
      user_pk : req.body.pk,
      user_sk : req.body.sk
    }, {
      headers: {
        'Authorization': `${process.env.AUTOMATION_TOOL_KEY}` //python app api key
      }
    }).then((result : any) => {
      if(result.data.status === true &&  result?.data?.data?.status_code === 100 || result?.data?.data?.status_code === 102) {
        res.status(200);
        res.send({
          success: true,
          message: "Search started!",
          taskStatus : result.data.data.status_code, 
          taskId : result?.data?.data?.task_id 
        });  
      } else {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
        });
      }
    }).catch((error : any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });  
    });
  }
  
  /**
    * blockSearchStop
    */
  public async blockSearchStop(req : Request, res : Response) {
    await  axios.get(`${process.env.AUTMATION_TOOL_BASE_URL}stop-task/${req.params.taskId}`, {
      headers: {
        'Authorization': `${process.env.AUTOMATION_TOOL_KEY}` //python app api key
      }
    }).then((result : any) => {
      if(result.data.status === true) {
        res.status(200);
        res.send({
          success: true,
          message: "Search stopped!"
        });  
      } else {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
        });
      }
    }).catch((error : any) => {
      res.status(500);
      res.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });  
    });
  }
  
}