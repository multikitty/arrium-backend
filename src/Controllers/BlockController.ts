import  moment from "moment";
import BlockServices from "../Services/BlockServices";

export default class BlockController {
  /**
    * addBlocks
    */
  public async addBlocks(request: any, response: any) {
    let batchNumber = 1;
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
        let duration : string = String(difference.asHours());
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
        // add block item in array
        batchItemsList.push(blockItem)
        if(batchItemsList.length === batchSize || i+1 === blockList.length) {
          // execute batch write operation
          await new BlockServices().insertBlocks(batchItemsList).then(async (result: any) => {
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
}