import { Request, Response, response } from 'express';
import { LocationServices } from '../Services/LocationServices';
import { AddCountryObj, AddRegionObj, AddStationObj, AddStationTypeObj } from '../Interfaces/countryInterface';
import CommonServices from '../Services/CommonServices';
import { EntitySkPk } from '../Interfaces/commonInterface';
import ZendeskServices from '../Services/ZendeskServices';
import { ZendeskCreateOrganization } from '../Interfaces/zendeskInterface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';

export default class LocationController {
   /**
    * addCountry
    */
   public async addCountry(req: Request, res: Response) {
      let countryData: AddCountryObj = {
         sk: `${req.body.countryCode}#${req.body.country}`,
         pk: "country",
         country: req.body.country,
         countryCode: req.body.countryCode
      }

      await new LocationServices().setCountry(countryData)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Country added successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
      * deleteCountry
      */
   public async deleteCountry(req: Request, res: Response) {
      let deleteItem: EntitySkPk = {
         sk: req.body.sortKey,
         pk: req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Country deleted successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
   * fetchAllCountry 
   */
   public async fetchAllCountry(req: Request, res: Response) {
      await new LocationServices().getCountryList()
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Country list fetched successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   // add region 
   public async addRegion(req: Request, res: Response) {
      // creat organisation
      let zendeskParams: ZendeskCreateOrganization = {
         name: `${req.body.regionName}(${req.body.regionCode})`,
         organization_fields: { flexCountry: req.body.countryCode }
      }

      // check region already exist
      let keyParams = {
         sk: `${req.body.countryCode}#${req.body.regionCode}`,
         pk: "region",
      }
      await new CommonServices().getEntity(keyParams)
         .then(async (result: PromiseResult<DocumentClient.GetItemOutput, AWSError>) => {
            if (result.Item) {
               res.status(422);
               res.send({
                  success: false,
                  message: "Region already exist!",
               });
            } else {
               await new ZendeskServices().createZendeskOrganisation(zendeskParams).then(async (resp) => {
                  if (resp.status === 201 && resp?.data?.organization?.id) {
                     let regionData: AddRegionObj = {
                        sk: `${req.body.countryCode}#${req.body.regionCode}`,
                        pk: "region",
                        regionName: req.body.regionName,
                        regionCode: req.body.regionCode,
                        regionId: req.body.regionId,
                        zendeskID: resp?.data?.organization?.id
                     }
                     await new LocationServices().setRegion(regionData)
                        .then((result: any) => {
                           res.status(200);
                           res.send({
                              success: true,
                              message: "Region added successfully!",
                              data: result,
                           });
                        })
                        .catch((error: any) => {
                           res.status(500);
                           res.send({
                              success: false,
                              message: "Something went wrong, please try after sometime.",
                              error: error
                           });
                        })
                  } else {
                     res.status(500);
                     res.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                     });
                  }
               }).catch((error: any) => {
                  res.status(error.response?.status ?? 500);
                  res.send({
                     success: false,
                     message: error.response?.statusText ?? "Something went wrong, please try after sometime.",
                     error: error
                  });
               })
            }
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
      * deleteRegion
      */
   public async deleteRegion(req: Request, res: Response) {
      let deleteItem: EntitySkPk = {
         sk: req.body.sortKey,
         pk: req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Region deleted successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
   * fetchAllRegion 
   */
   public async fetchAllRegion(req: Request, res: Response) {
      await new LocationServices().getRegionList(req.query.coutnry_code)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Regions list fetched successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   // add Stations 
   public async addStations(req: Request, res: Response) {
      let stationData: AddStationObj = {
         sk: `${req.body.countryCode}#${req.body.regionCode}#${req.body.stationCode}`,
         pk: "station",
         regionName: req.body.regionName,
         regionCode: req.body.regionCode,
         regionId: req.body.regionId,
         stationName: req.body.stationName,
         stationCode: req.body.stationCode,
         stationId: req.body.stationId,
         stationType: req.body.stationType,
         address1: req.body.address1,
         address2: req.body.address2,
         address3: req.body.address3,
         city: req.body.city,
         state: req.body.state,
         postalCode: req.body.postalCode,
         latitude: req.body.latitude,
         longitude: req.body.longitude
      }

      await new LocationServices().setStation(stationData)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station added successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
   * fetch all Station types 
   */
   public async fetchAllStation(req: Request, res: Response) {
      let countryCode = req?.query?.countryCode;
      let regionCode = req?.query?.regionCode;
      let queryParam = "";
      // create filter param
      if (countryCode && regionCode) {
         queryParam = `${countryCode}#${regionCode}`;
      }
      // get data
      await new LocationServices().getStationList(queryParam)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station list fetched successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
      * delete Station 
      */
   public async deleteStation(req: Request, res: Response) {
      let deleteItem: EntitySkPk = {
         sk: req.body.sortKey,
         pk: req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station deleted successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   // add Station type 
   public async addStationType(req: Request, res: Response) {
      let stationData: AddStationTypeObj = {
         sk: `stationType#${req.body.stationType}`,
         pk: "stationType",
         stationType: req.body.stationType
      }

      await new LocationServices().setStationType(stationData)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station type added successfully!",
               data: result
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
   * fetch all Station types 
   */
   public async fetchAllStationType(req: Request, res: Response) {
      await new LocationServices().getStationTypeList()
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station Type list fetched successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

   /**
      * delete Station type
      */
   public async deleteStationType(req: Request, res: Response) {
      let deleteItem: EntitySkPk = {
         sk: req.body.sortKey,
         pk: req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
         .then((result: any) => {
            res.status(200);
            res.send({
               success: true,
               message: "Station type deleted successfully!",
               data: result,
            });
         })
         .catch((error: any) => {
            res.status(500);
            res.send({
               success: false,
               message: "Something went wrong, please try after sometime.",
               error: error
            });
         })
   }

}