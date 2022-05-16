import AWS from "aws-sdk"
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT
};
const dynamoDB = new AWS.DynamoDB.DocumentClient(serviceConfigOptions);

export const UserServices = {
    getUserDataService : async(data:any) => {
        return dynamoDB
        .get({
          TableName: "ArriumShiv",
          Key: {
            pk: data.pk,
            sk: data.sk
          },
        })
        .promise()
    },

    getAllUsersService: async(data:any) => {
      return dynamoDB
      .scan({
        TableName: "ArriumShiv",
        Limit:2,
      })
      .promise()
    }
}