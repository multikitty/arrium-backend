const { validationResult } = require("express-validator");

//Schema For login
export const validationSchema = (request: any, response: any, next: any) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    //manupulate errors validation result
    let errorData: any = {};
    for (let index = 0; index < errors.array().length; index++) {
      delete errors.array()[index].value;
      delete errors.array()[index].location;

      if (index === 0) {
        const key = errors.array()[index].param;
        errorData[key] = errors.array()[index].msg;
      } else {
        if (errors.array()[index].param !== errors.array()[index - 1].param) {
          const key = errors.array()[index].param;
          errorData[key] = errors.array()[index].msg;
        }
      }
    }
    response.status(200);
    response.send({
      success: false,
      message: "Please fill the form correctly.",
      validationError: errorData,
    });
  } else {
    next();
  }
};
