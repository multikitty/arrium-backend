import express from "express";
const router = express.Router();
router.use(express.json());

import { automationToolAuth } from "../Middlewares/automationToolAuth";
import AutomationToolController from "../Controllers/AutomationToolController";
import BlockController from "../Controllers/BlockController";

router.post(
  "/flex-details-preferences",
  automationToolAuth,
  new AutomationToolController().fetchFlexAndPreferences
);
//add blocks
router.post(
  "/add-blocks",
  automationToolAuth,
  new BlockController().addBlocks.bind(new BlockController())
);

export = router;
