import jwt from "jsonwebtoken";

export const authentication = (request: any, response: any, next: any) => {
  var token = request.headers["x-access-token"];

  if (!token)
    return response.status(200).send({
      success: false,
      message: "No token Provided",
    });

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,
    function (err: any, decoded: any) {
      if (err)
        return response.status(200).send({
          success: false,
          message: "Failed to authenticate token",
        });
      // console.log('getting data', decoded)
      // if everything good, save to request for use in other routes
      request.body.pk = decoded.pk;
      request.body.sk = decoded.sk;
      next();
    }
  );
};
