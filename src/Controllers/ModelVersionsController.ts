import fs from "fs";
import modelIds from "../Utils/modelVersion.json"
import ModelVersionsServices from '../Services/ModelVersionsServices';
import { EntitySkPk } from "../Interfaces/commonInterface";
import CommonServices from "../Services/CommonServices";
import { Request, Response } from "express";

export default class ModelVersionsController {
    /**
    * addPhoneModel
    */
    public async addPhoneModel(req: any, res: any) {
        //For Generating Model Id for SK pattern
        let idObj = modelIds;
        idObj.lastPhoneModelId = idObj.lastPhoneModelId+1;
        fs.writeFile("src/Utils/modelVersion.json", JSON.stringify(idObj), async (err : any) => {
            if (err) {
                res.status(500);
                res.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: err
                });
            } else {
                // phone model data
                let data = {
                    pk : "phoneModel",
                    sk : `phoneModel#${idObj.lastPhoneModelId}`,
                    modelName: req.body.modelName,
                    modelId : req.body.modelId
                }
                await new ModelVersionsServices().addPhoneModel(data).then((result : any) => {
                    res.status(200);
                    res.send({
                        success: true,
                        message: "Phone model added successfully!",
                        data: result,
                    });  
                }).catch((error : any) => {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                        error : error
                    });  
                })
            }
        })
    }
    /**
    * getPhoneModelList
    */
    public async getModelVersionList(req: any, res: any) {
        await new ModelVersionsServices().getModelVersionList(req.query).then((result : any) => {
            res.status(200);
            res.send({
                success: true,
                message: "List fetched successfully!",
                data: result,
            });  
        }).catch((error : any) => {
            res.status(500);
            res.send({
                success: false,
                message: "Something went wrong, please try after sometime.",
                error : error
            });  
        })
    }
    // add os version
    public async addOsVersion(req: any, res: any) {
        //For Generating version id for SK pattern
        let idObj = modelIds;
        idObj.lastOsVersionId = idObj.lastOsVersionId+1;
        fs.writeFile("src/Utils/modelVersion.json", JSON.stringify(idObj), async (err : any) => {
            if (err) {
                res.status(500);
                res.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: err
                });
            } else {
                // os version data
                let data = {
                    pk : "osVersion",
                    sk : `osVersion#${idObj.lastOsVersionId}`,
                    osVersion: req.body.osVersion
                }
                await new ModelVersionsServices().addOsVersion(data).then((result : any) => {
                    res.status(200);
                    res.send({
                        success: true,
                        message: "OS Version added successfully!",
                        data: result,
                    });  
                }).catch((error : any) => {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                        error : error
                    });  
                })
            }
        })
    }
    // add flex version
    public async addFlexVersion(req: any, res: any) {
        //For Generating version id for SK pattern
        let idObj = modelIds;
        idObj.lastFlexVersionId = idObj.lastFlexVersionId+1;
        fs.writeFile("src/Utils/modelVersion.json", JSON.stringify(idObj), async (err : any) => {
            if (err) {
                res.status(500);
                res.send({
                    success: false,
                    message: "Something went wrong, please try after sometime.",
                    error: err
                });
            } else {
                // flex version data
                let data = {
                    pk : "flexVersion",
                    sk : `flexVersion#${idObj.lastFlexVersionId}`,
                    flexVersion: req.body.flexVersion
                }
                await new ModelVersionsServices().addFlexVersion(data).then((result : any) => {
                    res.status(200);
                    res.send({
                        success: true,
                        message: "Flex Version added successfully!",
                        data: result,
                    });  
                }).catch((error : any) => {
                    res.status(500);
                    res.send({
                        success: false,
                        message: "Something went wrong, please try after sometime.",
                        error : error
                    });  
                })
            }
        })
    }

     /**
      * deleteModelVersion
      */
    public async deleteModelVersion(req: Request, res: Response) {
        let deleteItem : EntitySkPk = {
            sk : req.body.deleteSk,
            pk : req.body.deletePk
        }
        // delete
        await new CommonServices().deleteItem(deleteItem)
        .then((result : any) => {
            res.status(200);
            res.send({
                success: true,
                message: "Deleted successfully!",
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