import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { AnesthesiaService } from "./anesthesia.service.js";

// ---- Helper: Validate MongoDB ObjectId ----
const isValidId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// ---- Create a new session ----
const createSession = catchAsync(async (req: Request, res: Response) => {
  const { visitId, petId, businessBranchId } = req.body;
  const existing = await AnesthesiaService.getSessionByVisit(visitId);
  if (existing) {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Anesthesia session already exists for this visit",
      data: existing,
    });
  }
  const result = await AnesthesiaService.createSession({ visitId, petId, businessBranchId });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Anesthesia session created successfully",
    data: result,
  });
});

// ---- Get session by visit ID ----
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
  const result = await AnesthesiaService.getSessionByVisit(visitId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result ? "Anesthesia session retrieved successfully" : "No anesthesia session found for this visit",
    data: result,
  });
});

// ---- Update consent data ----
const updateConsent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.updateConsent(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Consent data updated successfully",
    data: result,
  });
});

// ---- Save Pre-Medication data ----
const updatePreMed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.updatePreMedication(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pre-medication data saved successfully",
    data: result,
  });
});

// ---- Start Pre-Medication timer ----
const startPreMedTimer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.startPreMedTimer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pre-medication timer started",
    data: result,
  });
});

// ---- Complete Pre-Medication ----
const completePreMed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const { preMedEffect, ...restData } = req.body;
  // Pass all remaining data to the service – it will save them before completing
  const result = await AnesthesiaService.completePreMed(id, preMedEffect, restData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pre-medication phase completed",
    data: result,
  });
});

// ---- Save Induction data ----
const updateInduction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.updateInduction(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Induction data saved successfully",
    data: result,
  });
});

// ---- Start Induction timer ----
const startInductionTimer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.startInductionTimer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Induction timer started",
    data: result,
  });
});

// ---- Complete Induction ----
const completeInduction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.completeInduction(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Induction phase completed",
    data: result,
  });
});

// ---- Add monitoring entry ----
const addMonitoringEntry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const { vitals, timeRange, duration, eventLog } = req.body;
  const entry = { vitals, timeRange, duration };
  const result = await AnesthesiaService.addMonitoringEntry(id, entry, eventLog);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Monitoring entry added successfully",
    data: result,
  });
});

// ---- Complete entire session ----
const completeSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid session ID format",
      data: null,
    });
  }
  const result = await AnesthesiaService.completeSession(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Anesthesia session completed",
    data: result,
  });
});

export const AnesthesiaController = {
  createSession,
  getByVisit,
  updateConsent,
  updatePreMed,
  startPreMedTimer,
  completePreMed,
  updateInduction,
  startInductionTimer,
  completeInduction,
  addMonitoringEntry,
  completeSession,
};