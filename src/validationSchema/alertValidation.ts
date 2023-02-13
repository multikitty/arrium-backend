const { body } = require("express-validator");

export const alertValidation = {
    /**
        * createBlockNotification
        */
    createBlockNotification: [
            body('price').trim().not().isEmpty().withMessage('Block Price is required'),
            body('blockStartDate').trim().not().isEmpty().withMessage('Block start date is required'),
            body('blockEndDate').trim().not().isEmpty().withMessage('Block end date is required'),
            body('stationCode').trim().not().isEmpty().withMessage('Block stations code is required'),
            body('stationName').trim().not().isEmpty().withMessage('Block stations name is required'),
            body('sessionTime').trim().not().isEmpty().withMessage('Block session time Role is required'),
            body('offerID').trim().not().isEmpty().withMessage('Block session time Role is required')
        ],
    
}
