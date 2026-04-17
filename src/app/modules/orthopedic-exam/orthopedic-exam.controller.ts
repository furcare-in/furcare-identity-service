// @ts-nocheck
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { OrthopedicExamService } from "./orthopedic-exam.service.js";

// ---- Helper: Validate MongoDB ObjectId ----
const isValidId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// ---- Upsert Orthopedic Exam (Create or Update) ----
const upsertOrthopedicExam = catchAsync(async (req: Request, res: Response) => {
  const result = await OrthopedicExamService.upsertOrthopedicExam(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orthopedic exam saved successfully",
    data: result,
  });
});

// ---- Get Orthopedic Exam by Visit ID ----
const getByVisit = catchAsync(async (req: Request, res: Response) => {
  const { visitId } = req.params;
  if (!isValidId(visitId)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid visit ID format",
      data: null,
    });
  }
  const result = await OrthopedicExamService.getOrthopedicExamByVisitId(visitId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "Orthopedic exam retrieved successfully" : "No orthopedic exam found for this visit",
    data: result,
  });
});

export const OrthopedicExamController = {
  upsertOrthopedicExam,
  getByVisit,
};
