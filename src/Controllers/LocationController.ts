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
      // getCountry // validate country exist or not
      await new LocationServices().getCountry(`${req.body.countryCode}#`).then(async (result: PromiseResult<DocumentClient.QueryOutput, AWSError>) => {
         if (result.Count && result.Count > 0) {
            res.status(422);
            res.send({
               success: false,
               message: "Country already exist!",
            });
         } else {
            // create country
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
               // validate region ID here
               await new LocationServices().getRegionByIndex(req.body.regionId)
                  .then(async (result: any) => {
                     if (result.Count > 0) {
                        res.status(200);
                        res.send({
                           success: false,
                           message: 'A Region is already exist with the given Region ID!',
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
                              error: error?.response?.data
                           });
                        })
                     }
                  })
                  .catch((error) => {
                     res.status(500);
                     res.send({
                        success: false,
                        message: 'Something went wrong, please try after sometime.',
                        error: error,
                     });
                  });
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

   // for update region 
   public async updateRegion(req: Request, res: Response) {
      // validate region ID here
      await new LocationServices().getRegionByIndex(req.body.regionID)
         .then(async (result: PromiseResult<DocumentClient.QueryOutput, AWSError>) => {
            if (result.Count && result.Count > 1) {
               res.status(200);
               res.send({
                  success: false,
                  message: 'A Region is already exist with the given Region ID!',
               });
            } else {
               if (result.Items) {
                  let resultItem = result?.Items[0]
                  if ((resultItem?.sk === req.body.regSk) || result.Items.length === 0) {
                     // update zendesk org name

                     //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< need to fetch zendeskOrgID from LSI of region >>>>>>>>>>>>>>>>>>>>>
                     // let zendeskParams: ZendeskCreateOrganization = {
                     //    name: `${req.body.regionName}(${resultItem.regionCode})`,
                     //    organization_fields: { flexCountry: resultItem.countryCode }
                     // }


                     await new LocationServices().updateRegion(req.body).then((result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>) => {
                        if (result.Attributes) {
                           res.status(200);
                           res.send({
                              success: true,
                              message: "Region updated successfully.",
                              data: result.Attributes
                           });
                        } else {
                           res.status(500);
                           res.send({
                              success: false,
                              message: "Something went wrong, please try after sometime.",
                           });
                        }
                     }).catch((error) => {
                        res.status(500);
                        res.send({
                           success: false,
                           message: 'Something went wrong, please try after sometime.',
                           error: error
                        });
                     })
                  } else {
                     res.status(200);
                     res.send({
                        success: false,
                        message: 'A Region is already exist with the given Region ID!',
                     });
                  }
               } else {
                  res.status(500);
                  res.send({
                     success: false,
                     message: 'Something went wrong, please try after sometime.'
                  });
               }
            }
         })
         .catch((error) => {
            res.status(500);
            res.send({
               success: false,
               message: 'Something went wrong, please try after sometime.',
               error: error,
            });
         });
   }


   /**
      * deleteRegion
      */
   public async deleteRegion(req: Request, res: Response) {
      try {
         let deleteItem: EntitySkPk = {
            sk: req.body.sortKey,
            pk: req.body.partitionKey
         }

         // get region =>
         let regionData = await new CommonServices().getEntity(deleteItem);
         if (regionData.Item) {
            let zendeskOrgID = regionData.Item.zendeskOrgID;
            // delete zendesk org
            await new ZendeskServices().deleteZendeskOrganisation(zendeskOrgID).then(async () => {
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
            }).catch((error) => {
               res.status(404);
               res.send({
                  success: false,
                  message: "ZedneskOrgID invalid.",
                  error: error
               });
            });
         } else {
            res.status(404);
            res.send({
               success: false,
               message: "Region not found."
            });
         }
      } catch (error) {
         res.status(500);
         res.send({
            success: false,
            message: "Something went wrong, please try after sometime.",
            error: error
         });
      }
   }


   /**
   * fetchAllRegion 
   */
   public async fetchAllRegion(req: Request, res: Response) {
      await new LocationServices().getRegionList(req.query.country_code)
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

      // check station already exist
      let keyParams = {
         sk: stationData.sk,
         pk: "station",
      }
      await new CommonServices().getEntity(keyParams)
         .then(async (result: PromiseResult<DocumentClient.GetItemOutput, AWSError>) => {
            if (result.Item) {
               res.status(422);
               res.send({
                  success: false,
                  message: "Station already exist!",
               });
            } else {
               // check station exist or not 
               await new LocationServices().getStationByIndex(req.body.stationId)
                  .then(async (result: any) => {
                     if (result.Count > 0) {
                        res.status(200);
                        res.send({
                           success: false,
                           message: 'A Station is already exist with the given Station ID!',
                        });
                     } else {
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
                  })
                  .catch((error) => {
                     res.status(500);
                     res.send({
                        success: false,
                        message: 'Something went wrong, please try after sometime.',
                        error: error,
                     });
                  });
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



   // for update region 
   public async updateStation(req: Request, res: Response) {
      // check station already exist
      await new LocationServices().getStationByIndex(req.body.stationId)
         .then(async (result: PromiseResult<DocumentClient.QueryOutput, AWSError>) => {
            if (result.Count && result.Count > 1) {
               res.status(200);
               res.send({
                  success: false,
                  message: 'A Station is already exist with the given Station ID!',
               });
            } else {
               if (result.Items) {
                  let resultItem = result?.Items[0]
                  if ((resultItem?.sk === req.body.stationSk) || result.Items.length === 0) {
                     await new LocationServices().updateStation(req.body).then((result: PromiseResult<DocumentClient.UpdateItemOutput, AWSError>) => {
                        if (result.Attributes) {
                           res.status(200);
                           res.send({
                              success: true,
                              message: "Station updated successfully.",
                              data: result.Attributes
                           });
                        } else {
                           res.status(500);
                           res.send({
                              success: false,
                              message: "Something went wrong, please try after sometime.",
                           });
                        }
                     }).catch((error) => {
                        res.status(500);
                        res.send({
                           success: false,
                           message: 'Something went wrong, please try after sometime.',
                           error: error
                        });
                     })
                  } else {
                     res.status(200);
                     res.send({
                        success: false,
                        message: 'A Station is already exist with the given Station ID!',
                     });
                  }
               } else {
                  res.status(500);
                  res.send({
                     success: false,
                     message: "Something went wrong, please try after sometime."
                  });
               }
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
      // validate station type exist or not
      await new CommonServices().getEntity({
         pk: stationData.pk,
         sk: stationData.sk
      }).then(async (result: PromiseResult<DocumentClient.GetItemOutput, AWSError>) => {
         if (result.Item) {
            res.status(422);
            res.send({
               success: false,
               message: "Station type already exist!",
            });
         } else {
            // create station type
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