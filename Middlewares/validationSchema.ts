const { validationResult } = require("express-validator");

//Schema For login
export const validationSchema = (request: any, response: any, next: any) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(200);
    response.send({
      success: false,
      message: "Please fill the form correctly.",
      validationError: errors.array(),
      // error_code: errors.array()[0].param,
      // error_msg: errors.array()[0].msg,
    });
  } else {
    next();
  }
};
