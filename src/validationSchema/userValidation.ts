const { body } = require("express-validator");


export default class UserValidation {
    /**
        * addUser
        */
    public addUser() {
        return [
            body('firstname').trim().not().isEmpty().withMessage('First name is required').isLength({ min: 2, max: 40 }).withMessage('Please provide valid First name'),
            body('lastname').trim().not().isEmpty().withMessage('Surname is required').isLength({ min: 2, max: 40 }).withMessage('Please provide valid Surname'),
            body('phoneNumber').trim().not().isEmpty().withMessage('Phone number is required').isLength({ min: 8, max: 13 }).withMessage('Please provide valid Phone number'),
            body('dialCode').trim().not().isEmpty().withMessage('Dial code is required'),
            body('email').trim().not().isEmpty().withMessage('Email is required').isEmail().withMessage("Please enter valid email"),
            body('emailVerified').trim().not().isEmpty().withMessage('Email Verified is required'),
            body('dialCode').trim().not().isEmpty().withMessage('Dial code is required'),
            body('tzName').trim().not().isEmpty().withMessage('Timezone is required').isLength({ min: 4 }).withMessage('Please provide valid timezone'),
            body("country").toUpperCase().trim().not().isEmpty().withMessage("Country is required"),
            body('userRole').trim().not().isEmpty().withMessage('User Role is required') 
                .isIn(['admin', 'driver', 'sales'])
                .withMessage('User Role must be any of them admin | driver | sales'),
            body('status').trim().not().isEmpty().withMessage('Status is required')
        ]
    }
}

