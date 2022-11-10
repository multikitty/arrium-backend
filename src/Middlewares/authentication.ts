import jwt from 'jsonwebtoken';

export const authentication = (userRole? : string) => {
  return (request: any, response: any, next: any) => {
    var token = request.headers['x-access-token'];
  
    if (!token)
      return response.status(401).send({
        success: false,
        message: 'No token Provided',
      });
  
    jwt.verify(token, process.env.JWT_SECRET_KEY as string, function (err: any, decoded: any) {
      if (err)
        return response.status(401).send({
          success: false,
          message: 'Failed to authenticate token',
        });
      // if everything good, save to request for use in other routes
      if(decoded.userRole === userRole || decoded.userRole === "admin") {
        request.body.pk = decoded.pk;
        request.body.sk = decoded.sk;
        request.body.role = decoded.userRole;
        next();
      } else {
        return response.status(403).send({
          success: false,
          message: 'Access denied!',
        });
      }
    });
  }
};
