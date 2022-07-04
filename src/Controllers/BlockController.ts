import BlockServices from "../Services/BlockServices";



export default class BlockController {
    

   /**
    * addBlocks
    */
   public  addBlocks(request: any, response: any) {
     new BlockServices().setBlock(request.body)
   }
}