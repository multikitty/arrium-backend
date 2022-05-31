

// DynamoDB Connection
import AWS from "aws-sdk"
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
};
export const dynamoDB = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);