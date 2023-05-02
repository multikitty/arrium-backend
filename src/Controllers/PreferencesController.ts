const _ = require("underscore");
const axios = require("axios");
import UserServices from "../Services/UserServices";
import PreferenceServices from "../Services/PreferenceServices";
import CommonServices from "../Services/CommonServices";
import { LocationServices } from "../Services/LocationServices";
import e, { Request, Response } from "express";
import { SchedulePreferenceObj } from "../Interfaces/preferencesInterface";

export default class PreferencesController {
  /**
   * addPreferencesByUser
   */
  public async addPreferencesByUser(req: any, res: any) {
    // function for getting weekday number
    const getWeekDayNumber = (weekDay: string) => {
      switch (weekDay) {
        case "mon":
          return 1;
          break;
        case "tue":
          return 2;
          break;
        case "wed":
          return 3;
          break;
        case "thu":
          return 4;
          break;
        case "fri":
          return 5;
          break;
        case "sat":
          return 6;
          break;
        case "sun":
          return 7;
          break;
        default:
          break;
      }
    };
    // add preferences
    let preferenceList = req.body.preferences;
    let preferredDays = req.body.days;
    let batchSize = 25;
    let batchItemsList = [];
    let failedItems: any[] = [];
    // loop through block list
    for (let i = 0; i < preferenceList.length; i++) {
      const listItem = preferenceList[i];
      let sortKey;

      // check for preffered days
      if (preferredDays.length) {
        // work for premium user =====>

        for (let j = 0; j < preferredDays.length; j++) {
          const day = preferredDays[j];
          if (day.active) {
            // create sort key
            sortKey = `availability#${getWeekDayNumber(day.value)}#${
              day.value
            }#${listItem.stationCode}`;
            // Create block item object
            let prefItem = {
              PutRequest: {
                Item: {
                  pk: req.body.pk,
                  sk: sortKey,
                  regionID: listItem.regionId,
                  stationID: listItem.stationId,
                  bDay: day.value,
                  tta: listItem.tta,
                  minPay: listItem.minPay,
                  minHourlyRate: listItem.minHourlyRate,
                  bStartTime: listItem.startTime,
                  bEndTime: listItem.endTime,
                  active: listItem.active,
                },
              },
            };
            // add block item in array
            batchItemsList.push(prefItem);
          }
          // insert batch
          if (
            batchItemsList.length === batchSize ||
            (i + 1 === preferenceList.length && j + 1 === preferredDays.length)
          ) {
            // execute batch write operation
            await new CommonServices()
              .batchWriteData(batchItemsList)
              .then(async (result: any) => {
                batchItemsList = []; // clear batchItemsList
                // store unprocessed (failed items)
                failedItems.push(result.UnprocessedItems);
                if (
                  i + 1 === preferenceList.length &&
                  j + 1 === preferredDays.length
                ) {
                  res.status(200);
                  res.send({
                    success: true,
                    message: "Preferences saved successfully.",
                    data: failedItems,
                  });
                }
              })
              .catch((error: any) => {
                res.status(500);
                res.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error: error,
                });
              });
          }
        }
      } else {
        //work for basic plan user ====>
        // create sort key
        sortKey = `availability#${listItem.stationCode}`;
        // Create block item object
        let prefItem = {
          PutRequest: {
            Item: {
              pk: req.body.pk,
              sk: sortKey,
              regionID: listItem.regionId,
              stationID: listItem.stationId,
              bDay: "",
              tta: listItem.tta,
              minPay: listItem.minPay,
              minHourlyRate: listItem.minHourlyRate,
              bStartTime: listItem.startTime,
              bEndTime: listItem.endTime,
              active: listItem.active,
            },
          },
        };
        // add block item in array
        batchItemsList.push(prefItem);
        // insert batch
        if (
          batchItemsList.length === batchSize ||
          i + 1 === preferenceList.length
        ) {
          // execute batch write operation
          await new CommonServices()
            .batchWriteData(batchItemsList)
            .then(async (result: any) => {
              batchItemsList = []; // clear batchItemsList
              // store unprocessed (failed items)
              failedItems.push(result.UnprocessedItems);
              if (i + 1 === preferenceList.length) {
                res.status(200);
                res.send({
                  success: true,
                  message: "Preferences saved successfully.",
                  data: failedItems,
                });
              }
            })
            .catch((error: any) => {
              res.status(500);
              res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error: error,
              });
            });
        }
      }
    }
  }

  /**
   * getPreferences
   */
  public async getPreferencesByUser(req: Request, res: Response) {
    let data = {
      pk: req.body.pk,
    };
    await new UserServices()
      .fetchAmznFlexDetails(data)
      .then(async (result) => {
        if (result.Item) {
          let countryCode = result.Item?.country;
          let regionCode = result.Item?.regionCode;
          if (regionCode && countryCode) {
            let queryParam = `${countryCode}#${regionCode}`;
            // get data
            await new LocationServices()
              .getStationList(queryParam)
              .then(async (result: any) => {
                if (result.Items.length > 0) {
                  let stationsData = result.Items;
                  let prefParams = {
                    userPK: req.body.pk,
                    day: undefined,
                  };
                  await new PreferenceServices()
                    .getPreferenceByUser(prefParams)
                    .then(async (result: any) => {
                      await new UserServices()
                        .getUserData(req.body)
                        .then((UserDataResult) => {
                          if (UserDataResult.Item) {
                            let preferencesData = result.Items;
                            let responseData = [];
                            for (let i = 0; i < stationsData.length; i++) {
                              const station = stationsData[i];
                              if (preferencesData.length > 0) {
                                let matchedPreference = _.findWhere(
                                  preferencesData,
                                  {
                                    stationID: station.stationID,
                                  }
                                );

                                let matchedPreferenceFilterBybDy = _.findWhere(
                                  preferencesData,
                                  {
                                    stationID: station.stationID,
                                    bDay: req.query.day,
                                  }
                                );
                                if (req.query.day === undefined) {
                                  if (matchedPreference) {
                                    let data = {
                                      station: station,
                                      preference: matchedPreference ?? [],
                                    };
                                    responseData.push(data);
                                  } else {
                                    let data = {
                                      station: station,
                                      preference: [],
                                    };
                                    responseData.push(data);
                                  }
                                } else if (matchedPreferenceFilterBybDy) {
                                  let data = {
                                    station: station,
                                    preference: matchedPreferenceFilterBybDy,
                                  };
                                  responseData.push(data);
                                } else {
                                  let data = {
                                    station: station,
                                    preference: [],
                                  };
                                  responseData.push(data);
                                }
                              } else {
                                let data = {
                                  station: station,
                                  preference: [],
                                };
                                responseData.push(data);
                              }
                            }

                            responseData = responseData.filter(
                              (item: { station: any }) =>
                                item.station.stationType ===
                                UserDataResult?.Item?.stationType
                            );
                            res.status(200);
                            res.send({
                              success: true,
                              message: "Preferences list fetched successfully.",
                              data: responseData,
                            });
                          }
                        })
                        .catch((error) => {
                          res.status(500);
                          res.send({
                            success: false,
                            message:
                              "Something went wrong, please try after sometime.",
                            error: error,
                          });
                        });
                    })
                    .catch((err: any) => {
                      res.status(500);
                      res.send({
                        success: false,
                        message:
                          "Something went wrong, please try after sometime.",
                        error: err,
                      });
                    });
                } else {
                  res.status(500);
                  res.send({
                    success: false,
                    message: "No location available.",
                  });
                }
              })
              .catch((error) => {
                res.status(500);
                res.send({
                  success: false,
                  message: "Something went wrong, please try after sometime.",
                  error: error,
                });
              });
          } else {
            res.status(500);
            res.send({
              success: false,
              message: "Please update your flex details.",
            });
          }
        } else {
          res.status(500);
          res.send({
            success: false,
            message: "Please update your flex details.",
          });
        }
      })
      .catch((error) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }

  /**
   * schedulePreferences
   */
  public async schedulePreferences(req: Request, res: Response) {
    let scheduleDataArr = req.body.schedules;
    let batchSize = 25;
    let batchItemsList: any[] = [];
    let failedItems: any = [];
    let scheduleList: any = [];
    for (let i = 0; i < scheduleDataArr.length; i++) {
      const listItem = scheduleDataArr[i];
      // schedule data
      let scheduleData: SchedulePreferenceObj = {
        pk: req.body.pk,
        sk: `schedule#${req.body.pk}#${i + 1}`,
        asDay: listItem.day,
        asStartTime: listItem.startTime,
        active: listItem.active,
      };
      // Create block item object
      let prefItem = {
        PutRequest: {
          Item: scheduleData,
        },
      };
      // add schedule item in array
      batchItemsList.push(prefItem);
      scheduleList.push({
        ...scheduleData,
        token: req.headers["x-access-token"],
        scheduleNumber: i + 1,
      });
      // add items to DB
      if (
        batchItemsList.length === batchSize ||
        i + 1 === scheduleDataArr.length
      ) {
        // execute batch write operation
        await new CommonServices()
          .batchWriteData(batchItemsList)
          .then(async (result: any) => {
            batchItemsList = []; // clear batchItemsList
            // store unprocessed (failed items)
            failedItems.push(result.UnprocessedItems);

            await new PreferenceServices().creactAutomationSchedule(
              scheduleList
            );

            if (i + 1 === scheduleDataArr.length) {
              res.status(200);
              res.send({
                success: true,
                message: "Availability schedule saved successfully.",
                data: failedItems,
              });
            }
          })
          .catch((error: any) => {
            res.status(500);
            res.send({
              success: false,
              message: "Something went wrong, please try after sometime.",
              error: error,
            });
          });
      }
    }
  }

  /**
   * getAvailabilitySchedule
   */
  public async getAvailabilitySchedule(req: Request, res: Response) {
    let data = {
      pk: req.body.pk,
    };
    await new PreferenceServices()
      .getAvailabilitySchedule(data)
      .then(async (result) => {
        if (result.Items) {
          res.status(200);
          res.send({
            success: true,
            message: "Data fetched successfully",
            data: result.Items,
          });
        } else {
          res.status(200);
          res.send({
            success: true,
            message: "No data found!",
            data: [],
          });
        }
      })
      .catch((error: any) => {
        res.status(500);
        res.send({
          success: false,
          message: "Something went wrong, please try after sometime.",
          error: error,
        });
      });
  }
}
