import express from "express";
const router = express.Router();
router.use(express.json());

import AlertController from "../Controllers/AlertController";
import { alertValidation } from "./../validationSchema/alertValidation";
import { validationSchema } from "./../Middlewares/validationSchema";
import { authentication } from "../Middlewares/authentication";

//add blocks notification
router.post(
  "/createBlockNotification",
  authentication("driver"),
  alertValidation.createBlockNotification,
  validationSchema,
  new AlertController().insertBlockNotification
);

//get blocks notification
router.get(
  "/blockNotification",
  authentication("driver"),
  new AlertController().getNotificationList
);

//get all notification
router.get(
  "/allNotification/:pk",
  authentication("driver"),
  new AlertController().getAllNotificationList
);

//update notification viewed status
router.post(
  "/updateAllViewedNotification",
  authentication("driver"),
  new AlertController().updateNotificationViewed
);

//update notification dismissed status
router.post(
  "/updateDismissedSingleNotification",
  authentication("driver"),
  new AlertController().updateDismissedDateInBlockNotification
);

// update notification dismissed all status
router.post(
  "/updateDismissedAllNotifications",
  authentication("driver"),
  new AlertController().updateDismissedDateInAllBlockNotification
);

// Testing Invoice api
router.post("/createInvoice", new AlertController().createInvoice);
export = router;
