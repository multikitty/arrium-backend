import { Request, Response } from 'express';
import { LocationServices } from '../Services/LocationServices';
import { AddCountryObj } from '../Interfaces/countryInterface';
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
}