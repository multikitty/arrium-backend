import express from "express";
const router = express.Router();
router.use(express.json());

import { authentication } from "./../Middlewares/authentication";
import BlockController from "../Controllers/BlockController";

// get searched blocks list
router.get("/", authentication, new BlockController().getBlockList);
//add blocks
router.post("/add", authentication, new BlockController().addBlocks.bind(new BlockController()));

export = router;
