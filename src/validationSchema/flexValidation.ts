const { body } = require("express-validator");


export default class FlexValidation {
    /**
    * country
    */
    public amznFlexValidation() {
        return [
            body("country").toLowerCase().trim().not().isEmpty().withMessage("Country is required"),
            body("countryCode").trim().toLowerCase().not().isEmpty().withMessage("Country code is required")
        ]
    }

    public region() {
        return [
            body("countryCode").trim().toLowerCase().not().isEmpty().withMessage("Country Code is required"),
            body("regionName").trim().not().isEmpty().withMessage("Region Name is required"),
            body("regionCode").trim().toUpperCase().not().isEmpty().withMessage("Region Code is required"),
            body("regionId").trim().not().isEmpty().withMessage("Region ID is required")
        ]
    }

    public station() {
        return [
            body("countryCode").trim().toLowerCase().not().isEmpty().withMessage("Country Code is required"),
            body("regionName").trim().not().isEmpty().withMessage("Region Name is required"),
            body("regionCode").trim().toUpperCase().not().isEmpty().withMessage("Region Code is required"),
            body("regionId").trim().not().isEmpty().withMessage("Region ID is required"),
            body("stationName").trim().not().isEmpty().withMessage("Station Name is required"),
            body("stationCode").trim().toUpperCase().not().isEmpty().withMessage("Station Code is required"),
            body("stationId").trim().not().isEmpty().withMessage("Station ID is required"),
            body("stationType").trim().not().isEmpty().withMessage("Station Type is required")
        ]
    }

    public stationType() {
        return [
            body("stationType").trim().not().isEmpty().withMessage("Station Type is required")
        ]
    }    
}

