import fs from "fs";
import modelIds from "../Utils/modelVersion.json"
import ModelVersionsServices from '../Services/ModelVersionsServices';

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
                console.log("dev iddd", idObj.lastPhoneModelId);
                // phone model data
                let data = {
                    pk : "phoneModel",
                    sk : `phoneModel#${idObj.lastPhoneModelId}`,
                    modelName: req.body.modelName,
                    modelId : req.body.modelId
                }
                await new ModelVersionsServices().addPhoneModel(data).then((result) => {
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

}