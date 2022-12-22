const { body } = require("express-validator");


export default class FlexValidation {
    public flexDetails() {
        return [
            body("flexUser").trim().not().isEmpty().withMessage("Flex user name is required"),
            body("flexPassword").trim().not().isEmpty().withMessage("Flex password is required"),
            body("accessToken").trim().not().isEmpty().withMessage("Access Token is required"),
            body("refreshToken").trim().not().isEmpty().withMessage("Refresh Token is required"),
            body("userAgent").trim().not().isEmpty().withMessage("User Agent is required"),
            body("flexId").trim().toUpperCase().not().isEmpty().withMessage("Flex ID is required"),
            body("country").trim().not().isEmpty().withMessage("Country is required"),
            body("region").trim().not().isEmpty().withMessage("Region is required")
            // body("devModel").trim().not().isEmpty().withMessage("Device Model is required"),
            // body("devType").trim().not().isEmpty().withMessage("Device type is required"),
            // body("devId").trim().not().isEmpty().withMessage("Device ID is required"),
            // body("devSerialNumber").trim().not().isEmpty().withMessage("Device serial number is required"),
            // body("osVersion").trim().not().isEmpty().withMessage("Device OS version is required"),
            // body("flexVersion").trim().not().isEmpty().withMessage("Flex version is required"),
            // body("amznId").trim().not().isEmpty().withMessage("Amazon ID is required"),
        ]
    }    
}

