import express from "express";
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
import { authentication } from "./../Middlewares/authentication";
import ZendeskController from "../Controllers/ZendeskController";

// upload file in zendesk
router.post("/upload", authentication("driver"), bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}), new ZendeskController().uploadFile);

// create ticket in zendesk
router.post("/createTicket", authentication("driver"), new ZendeskController().createTicket);

//get FAQ
router.get("/getFaq", authentication("all"), new ZendeskController().getFAQLists);


export = router;
