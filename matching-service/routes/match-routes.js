import express from "express";

import { startReceivingLogs, stopReceivingLogs, listen } from "../controllers/match-controller.js";

const router = express.Router();

router.post('/receive', startReceivingLogs);

router.post('/stop', stopReceivingLogs);

router.post('/listen', listen);

export default router;
