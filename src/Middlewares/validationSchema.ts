const { validationResult } = require("express-validator");

//Schema For login
export const validationSchema = (request: any, response: any, next: any) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    //manupulate errors validation result
    let errorData: any = [];
    for (let index = 0; index < errors.array().length; index++) {
      if (errors.array()[index].param !== errors?.array()[index - 1]?.param) {
        errorData.push(errors.array()[index]);
      }
    }
    response.status(200);
    response.send({
      success: false,
      message: "Please fill the form correctly.",
      validationError: errorData,
      // error_code: errors.array()[0].param,
      // error_msg: errors.array()[0].msg,
    });
  } else {
    next();
  }
};
