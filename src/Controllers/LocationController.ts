import { Request, Response } from 'express';
import { LocationServices } from '../Services/LocationServices';
import { AddCountryObj, AddRegionObj } from '../Interfaces/countryInterface';
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
}