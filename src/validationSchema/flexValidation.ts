const { body } = require("express-validator");


export default class FlexValidation {
    
    public flexDetails() {
        return [
            body("flexUser").trim().toLowerCase().not().isEmpty().withMessage("Country Code is required"),
            body("flexPassword").trim().not().isEmpty().withMessage("Region Name is required"),
            body("devModel").trim().toUpperCase().not().isEmpty().withMessage("Region Code is required"),
            body("devType").trim().not().isEmpty().withMessage("Region ID is required"),
            body("devId").trim().not().isEmpty().withMessage("Station Name is required"),
            body("devSerialNumber").trim().toUpperCase().not().isEmpty().withMessage("Station Code is required"),
            body("osVersion").trim().not().isEmpty().withMessage("Station ID is required"),
            body("flexVersion").trim().not().isEmpty().withMessage("Station Type is required"),
            body("amznId").trim().not().isEmpty().withMessage("Station Name is required"),
            body("flexId").trim().toUpperCase().not().isEmpty().withMessage("Station Code is required"),
            body("country").trim().not().isEmpty().withMessage("Station ID is required"),
            body("region").trim().not().isEmpty().withMessage("Station Type is required"),
        ]
    }    
}

