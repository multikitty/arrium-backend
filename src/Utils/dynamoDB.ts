import AWS from "aws-sdk"
const config = require('./config');
// configure aws dynamo db 
AWS.config.update(config.aws_remote_config);
// dynamo db initialization
export const dynamoDB = new AWS.DynamoDB.DocumentClient();
// table name for connection
export const TableName = config.aws_table_name
// GSI Index
export const GSI = {
    login : "GSI-Login",
}