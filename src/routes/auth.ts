import express from "express";
const router = express.Router();
router.use(express.json());
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "./../Middlewares/authentication";

import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import JsonWebTokenError from "jsonwebtoken";
import { authSchema } from "../validationSchema/authSchema";

let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
};
const dynamoDB = new AWS.DynamoDB(serviceConfigOptions);

//Auth testing Api
router.get("/authTest", async (request, response) => {
  response.status(200);
  response.send({
    status: true,
    message: "Hellow Auth api working fine!",
    data: [],
    error_code: false,
    error_msg: null,
    meta: null,
  });
});


export = router;
