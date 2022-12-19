const axios = require('axios');
import { Request, Response } from "express";
import { IFetchTimezoneByZoneResult, TimezoneListResponse } from "../Interfaces/timezoneInterface";

export default class TimezoneController {
  // for time zone list
  public async fetchTimezoneList(req: Request, res: Response) {
    await axios.get(`${process.env.TIMEZONE_API_BASE_URL}/list-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json${req.query.country ? '&country=' + req.query.country : ""}`)
      .then((result: any) => {
        if (result.status === 200 && result.data.status === "OK") {
          let responseData: TimezoneListResponse = result.data
          res.status(200);
          res.send({
            success: true,
            message: "Timezone list fetched",
            data: responseData
          });
        } else {
          res.status(500);
          res.send({
            success: false,
            message: result.data.message ?? "Something went wrong, please try after sometime.",
          });
        }
      }).catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error
        });
      });
  }

  // for time zone list by zone name
  public async fetchTimezoneDetails(req: Request, res: Response) {
    await axios.get(`${process.env.TIMEZONE_API_BASE_URL}/get-time-zone?key=${process.env.TIMEZONE_API_KEY}&format=json&by=zone&fields=zoneStart,zoneEnd,zoneName,gmtOffset&zone=${req.query.zone}`)
      .then((result: any) => {
        if (result.status === 200 && result.data.status === "OK") {
          let responseData: IFetchTimezoneByZoneResult = result.data;
          res.status(200);
          res.send({
            success: true,
            message: "Timezone Data fetched",
            data: responseData
          });
        } else {
          res.status(500);
          res.send({
            success: false,
            message: result.data.message ?? "Something went wrong, please try after sometime.",
          });
        }
      }).catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error
        });
      });
  }

}