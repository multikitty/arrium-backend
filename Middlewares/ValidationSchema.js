
const { validationResult } = require('express-validator')


//Schema For login
const ValidationSchema = (request, response, next) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    // return response.status(400).json({ errors: errors.array() });
    response.status(200)
    response.send({
      status: false,
      message: null,
      data: [],
      error_code: errors.array()[0].param,
      error_msg: errors.array()[0].msg,
      meta: null
    })
  } else {
    next();
  }

}




module.exports = ValidationSchema