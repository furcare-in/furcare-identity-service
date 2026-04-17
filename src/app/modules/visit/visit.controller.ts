// @ts-nocheck
// @ts-nocheck
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import pick from "../../../utils/pick.js";
import prisma from "../../../utils/prisma.js";
import { VisitService } from "./visit.service.js";
import { prescriptionInsightService } from "../prescription-insight/prescriptionInsight.service.js";

const createVisit = catchAsync(async (req: Request, res: Response) => {
    const { petId } = req.params;
    const data = { ...req.body };
    const staff = JSON.parse(req.headers['staff'] as string || '{}');

    // Robust ID Resolution
    if (petId && !data.petId) data.petId = petId;

    // Fetch hierarchical data if IDs are missing
    if ((!data.clientId || !data.businessBranchId) && data.petId) {
        const petInfo = await prisma.pet.findUnique({
            where: { id: Number(data.petId) },
            include: { client: true }
        });

        if (petInfo) {
            if (!data.clientId) data.clientId = petInfo.clientId;
            if (!data.businessBranchId) data.businessBranchId = petInfo.client?.businessBranchId;
        }
    }

    // Fallback for businessBranchId from staff/user context
    if (!data.businessBranchId) {
        data.businessBranchId = (req as any).user?.businessBranchId || staff.businessBranchId;
    }

    // Standard defaults for Prisma required fields
    if (!data.date) data.date = new Date();
    if (!data.reason) data.reason = "Medical Note";
    if (!data.status) data.status = "Completed";
    if (!data.author) data.author = staff?.name || 'Unknown';

    // Final Validation: Ensure critical IDs are present before Prisma call
    if (!data.clientId || !data.petId || !data.businessBranchId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: `Missing required identifiers: ${!data.clientId ? 'clientId' : ''} ${!data.petId ? 'petId' : ''} ${!data.businessBranchId ? 'businessBranchId' : ''}`.trim(),
            data: null,
        });
    }

    const result = await VisitService.createVisit(data);

    // Fire-and-forget: Process prescriptions for insights and observations
    prescriptionInsightService.processVisitPrescriptions(result).catch(() => {});

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Visit created successfully",
        data: result,
    });
});

const getVisits = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["search", "businessBranchId", "clientId", "petId", "status", "date"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await VisitService.getPaginatedVisits(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visits retrieved successfully",
        data: result,
    });
});

const getVisit = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid ID format",
            data: null,
        });
    }
    const result = await VisitService.getVisitById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit retrieved successfully",
        data: result,
    });
});

const updateVisit = catchAsync(async (req: Request, res: Response) => {
    const { id: paramsId } = req.params;
    const isBulk = Array.isArray(req.body);

    if (isBulk) {
        const result = await VisitService.bulkUpdateVisit(req.body);
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Visits updated successfully",
            data: result,
        });
    }

    // Single update
    const id = paramsId || req.body.id;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid or missing ID format",
            data: null,
        });
    }

    console.log("Updating visit:", id);
    console.log("Update Data:", JSON.stringify(req.body, null, 2));

    const result = await VisitService.updateVisit(id, req.body);
    console.log("Update Result:", JSON.stringify(result, null, 2));

    // Fire-and-forget: Process prescriptions if there are updates
    prescriptionInsightService.processVisitPrescriptions(result).catch(() => {});

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit updated successfully",
        data: result,
    });
});

const deleteVisit = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid ID format",
            data: null,
        });
    }
    const result = await VisitService.deleteVisit(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Visit deleted successfully",
        data: result,
    });
});

const getPatientInfo = catchAsync(async (req: Request, res: Response) => {
    const { petId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(petId)) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid Pet ID format",
            data: null,
        });
    }

    const pet = await prisma.pet.findUnique({
        where: { id: Number(petId) },
        include: { client: true, animalClass: true }
    });

    if (!pet) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Pet not found",
            data: null,
        });
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient info retrieved successfully",
        data: pet,
    });
});

const aiAutofillMedicalRecord = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const result = await VisitService.generateMedicalRecordAutofill(req.body, token);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "AI autofill generated successfully",
        data: result,
    });
});

export const VisitController = {
    createVisit,
    getVisits,
    getVisit,
    updateVisit,
    deleteVisit,
    getPatientInfo,
    aiAutofillMedicalRecord,
};
