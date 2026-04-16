import express from "express";
import { OrthopedicExamController } from "./orthopedic-exam.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import { OrthopedicExamValidator } from "./orthopedic-exam.validator.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(OrthopedicExamValidator.createOrUpdateOrthopedicExamSchema),
  OrthopedicExamController.upsertOrthopedicExam
);

router.get(
  "/visit/:visitId",
  auth(),
  OrthopedicExamController.getByVisit
);

export const orthopedicExamRouter = router;
