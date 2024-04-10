import express from "express";

import { verifyAccessToken, verifyIsAdmin } from "../middleware/basic-access-control.js";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById, updateQuestion } from "../controller/question-controller.js";

const router = express.Router();

router.get("/all", verifyAccessToken, getAllQuestions);

router.get("/:id", verifyAccessToken, getQuestionById);

router.post("/", createQuestion);

router.put("/:id", verifyAccessToken, verifyIsAdmin, updateQuestion);

router.delete("/:id", verifyAccessToken, verifyIsAdmin, deleteQuestion);

export default router;
