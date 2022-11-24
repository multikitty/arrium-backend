import { dynamoDB, TableName } from '../Utils/dynamoDB';

export default class BlockServices {
    
  /*
    * add block list
    */
  public insertBlocks(data : any) {
    return dynamoDB.batchWrite({
      RequestItems: {
        [TableName] : data
      }
    }).promise()
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
   * updateBatchNumber
   */
  public updateBatchNumber(data : any) {
    let params = {
      TableName: TableName,
      Key: {
        pk: data.userPk,
        sk: "batchnumber"
      }, 
      UpdateExpression: `SET #9f5e0 = :9f5e0`,
      ExpressionAttributeValues: {
        ":9f5e0": data.batchNumber
      },
      ExpressionAttributeNames: {
        "#9f5e0": "batch"
      },
      ReturnValues: "ALL_NEW",
    }
    return dynamoDB.update(params).promise();
  }
  /**
   * getBlock
   */
  public getBlockList(data : any) {
    let queryParams = {
      TableName: TableName,
      ScanIndexForward: true,
      ConsistentRead: false,
      KeyConditionExpression: `#bef90 = :bef90 And begins_with(#bef91, :bef91)`,
      ExpressionAttributeValues: {
        ":bef90": data.userPk,
        ":bef91": `block#`
      },
      "ExpressionAttributeNames": {
        "#bef90": "pk",
        "#bef91": "sk"
      }
    }
    return dynamoDB.query(queryParams).promise();
  }
}