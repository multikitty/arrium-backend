const { body } = require("express-validator");

export default class ReferralValidation {
    /**
        * createReferral
        */
    public createReferral() {
        return [
            body("country").toUpperCase().trim().not().isEmpty().withMessage("Country is required"),
            body('region').trim().not().isEmpty().withMessage('Region is required'),
            body('station').trim().not().isEmpty().withMessage('Station is required'),
            body('numberOfReferral').trim().not().isEmpty().withMessage('Referral count is required'),
            body('assignTo').trim().not().isEmpty().withMessage('User Role is required')
        ]
    }
}
