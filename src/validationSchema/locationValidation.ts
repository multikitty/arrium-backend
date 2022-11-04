const { body } = require("express-validator");


export default class LocationValidation {
    /**
    * country
    */
    public country() {
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
            body("stationType").trim().not().isEmpty().withMessage("Station Type is required"),
            body("address1").trim().not().isEmpty().withMessage("Address1 Type is required"),
            body("address2").trim().not().isEmpty().withMessage("Address2 Type is required"),
            body("address3").trim().not().isEmpty().withMessage("Address3 Type is required"),
            body("city").trim().not().isEmpty().withMessage("City Type is required"),
            body("state").trim().not().isEmpty().withMessage("State Type is required"),
            body("postalCode").trim().not().isEmpty().withMessage("Postal Code Type is required"),
            body("latitude").trim().not().isEmpty().withMessage("Latitude Type is required"),
            body("longitude").trim().not().isEmpty().withMessage("Longitude Type is required"),
        ]
    }

    public stationType() {
        return [
            body("stationType").trim().not().isEmpty().withMessage("Station Type is required")
        ]
    }    
}

