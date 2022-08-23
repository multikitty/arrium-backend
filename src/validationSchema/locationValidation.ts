const { body } = require("express-validator");


export default class LocationValidation {
    /**
    * country
    */
    public country() {
        return [
            body("country").trim().not().isEmpty().withMessage("Country is required"),
            body("countryCode").trim().not().isEmpty().withMessage("Country code is required")
        ]
    }

    public region() {
        return [
            body("countryCode").trim().not().isEmpty().withMessage("Country Code is required"),
            body("regionName").trim().not().isEmpty().withMessage("Region Name is required"),
            body("regionCode").trim().not().isEmpty().withMessage("Region Code is required"),
            body("regionId").trim().not().isEmpty().withMessage("Region ID is required")
        ]
    }
   
}

