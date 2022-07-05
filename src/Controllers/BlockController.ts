// import BlockServic/es from "../Services/BlockServices";



export default class BlockController {
    

   /**
    * addBlocks
    */
  public addBlocks(request: any, response: any) {
    let batchNumber = 1;
    new BlockServices().getBatchNumber(request.body.pk).then((result) => {
      if(result.Item) {
        let newBatchNumber = result.Item?.batch + 1;
        batchNumber = newBatchNumber;
        // console.log(result.Item)

        // 
      }
    }).catch((error) => {
      response.status(500);
      response.send({
        success: false,
        message: "Something went wrong, please try after sometime.",
        error : error
      });  
    });
    // new BlockServices().setBlock(request.body)
  }
}