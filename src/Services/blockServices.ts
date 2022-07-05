import { dynamoDB, TableName } from "../Utils/dynamoDB"

export default class BlockServices {
    
    /**
      * setBlock
      */
    public setBlock(data : any) {
      console.log(data.blockItems)
    }

   /**
    * getBatchNumber
    */
   public getBatchNumber(userPk : String) {
    let params = {
      TableName: TableName,
      Key: {
        pk: userPk,
        sk: "batchnumber"
      } 
    }
    return dynamoDB.get(params).promise()
   }
  
    /**
     * getBlock
     */
    // public getBlock(data : Object) {
      
    // }
  }