import {dynamoDB} from '../utils/dynamoDB'

export const userServices = {
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
        Limit:5,
      })
      .promise()
    }
}