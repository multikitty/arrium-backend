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
   
}

