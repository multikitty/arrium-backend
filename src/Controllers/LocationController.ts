import { Request, Response } from 'express';
import { LocationServices } from '../Services/LocationServices';
import { AddCountryObj, AddRegionObj, AddStationObj, AddStationTypeObj } from '../Interfaces/countryInterface';
import CommonServices from '../Services/CommonServices';
import { EntitySkPk } from '../Interfaces/commonInterface';

export default class LocationController {
   /**
    * addCountry
    */
   public async addCountry(req: Request, res: Response) {
      let countryData : AddCountryObj = {
         sk : `${req.body.countryCode}#${req.body.country}`,
         pk : "country",
         country : req.body.country,
         countryCode : req.body.countryCode
      }

      await new LocationServices().setCountry(countryData)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Country added successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let deleteItem : EntitySkPk = {
         sk : req.body.sortKey,
         pk : req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Country deleted successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Country list fetched successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let regionData : AddRegionObj = {
         sk : `${req.body.countryCode}#${req.body.regionCode}`,
         pk : "region",
         regionName : req.body.regionName,
         regionCode : req.body.regionCode,
         regionId : req.body.regionId
      }

      await new LocationServices().setRegion(regionData)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Region added successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let deleteItem : EntitySkPk = {
         sk : req.body.sortKey,
         pk : req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Region deleted successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Regions list fetched successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let stationData : AddStationObj = {
         sk : `${req.body.countryCode}#${req.body.regionCode}#${req.body.stationCode}`,
         pk : "station",
         regionName : req.body.regionName,
         regionCode : req.body.regionCode,
         regionId : req.body.regionId,
         stationName : req.body.stationName,
         stationCode : req.body.stationCode,
         stationId : req.body.stationId,
         stationType : req.body.stationType
      }

      await new LocationServices().setStation(stationData)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station added successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      if(countryCode && regionCode) {
         queryParam = `${countryCode}#${regionCode}`;
      }
      // get data
      await new LocationServices().getStationList(queryParam)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station list fetched successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let deleteItem : EntitySkPk = {
         sk : req.body.sortKey,
         pk : req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station deleted successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let stationData : AddStationTypeObj = {
         sk : `stationType#${req.body.stationType}`,
         pk : "stationType",
         stationType : req.body.stationType
      }

      await new LocationServices().setStationType(stationData)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station type added successfully!",
             data: result
         });  
      })
      .catch((error : any) => {
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
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station Type list fetched successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
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
      let deleteItem : EntitySkPk = {
         sk : req.body.sortKey,
         pk : req.body.partitionKey
      }
      // delete
      await new CommonServices().deleteItem(deleteItem)
      .then((result : any) => {
         res.status(200);
         res.send({
             success: true,
             message: "Station type deleted successfully!",
             data: result,
         });  
      })
      .catch((error : any) => {
         res.status(500);
         res.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error
         });
      })
   }

}