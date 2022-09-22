import jwt from "jsonwebtoken";

export const automationToolAuth = (request: any, response: any, next: any) => {
    let token = request.headers["x-access-token"];
    let reqToken = request.body?.verifyRequestToken

    if (!token && reqToken)
        return response.status(401).send({
            success: false,
            message: "Please Provide valid access token.",
        });

    jwt.verify(
        token,
        process.env.AUTOMATION_TOOL_SECRET as string,
        function (err: any, decoded: any) {
            if (err) {
                return response.status(401).send({
                    success: false,
                    message: "Failed to authenticate access token",
                });
            } else {
                // if everything good, save to request for use in other routes
                request.body.pk = decoded.pk;
                request.body.sk = decoded.sk;
                // verify request token
                jwt.verify(
                    reqToken,
                    process.env.AUTOMATION_TOOL_REQUEST_SECRET as string,
                    function (err: any, decoded: any) {
                        if (err) {
                            return response.status(401).send({
                                success: false,
                                message: "Failed to authenticate request verification token",
                            });
                        } else {
                            next();
                        }
                    }
                );
            }
        }
    );
};
