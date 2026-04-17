// @ts-nocheck
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync.js";
import sendResponse from "../../../utils/sendResponse.js";
import { productService } from "./product.service.js";
import pick from "../../../utils/pick.js";
import { openFdaService } from "../external-api/openfda.service.js";
import { veterinaryService } from "../external-api/veterinary.service.js";
import { masterMedicineService } from "../master-medicine/masterMedicine.service.js";

const createProduct = catchAsync(async (req, res) => {
    const result = await productService.createProduct(req.body);

    // Brain: Learn from newly created product (fire-and-forget)
    masterMedicineService.learnFromInventory(result).catch(() => {});

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Product created successfully",
        data: result,
    });
});

const getAllProducts = catchAsync(async (req, res) => {
    const filters = pick(req.query, ["search", "businessBranchId", "category", "supplierId", "active"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await productService.getAllProducts(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products fetched successfully",
        data: result,
    });
});

const getProductById = catchAsync(async (req, res) => {
    const result = await productService.getProductById(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product fetched successfully",
        data: result,
    });
});

const updateProduct = catchAsync(async (req, res) => {
    const result = await productService.updateProduct(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
});

const deleteProduct = catchAsync(async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product deleted successfully",
        data: result,
    });
});

const calculateDosage = catchAsync(async (req, res) => {
    const result = await productService.calculateDosage(req.params.id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dosage calculated successfully",
        data: result,
    });
});

const searchOpenFda = catchAsync(async (req, res) => {
    const query = req.query.q as string;

    // Return empty if query is too short (safety)
    if (!query || query.length < 3) {
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "OpenFDA search results fetched successfully",
            data: { medicines: [], availableForms: [], formCounts: {}, totalCount: 0, found: false },
        });
    }

    try {
        // Step 1: Ask the Brain first (30-80ms)
        const brainResults = await masterMedicineService.search(query);

        if (brainResults.found && brainResults.isComplete) {
            // Brain has complete data — skip FDA entirely (FAST path)
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "OpenFDA search results fetched successfully",
                data: brainResults,
            });
        }

        // Step 2: Brain found nothing or partial — fall back to FDA
        const fdaResults = await openFdaService.searchDrugs(query);

        // Step 3: Merge Brain intelligence into FDA results
        const mergedResults = brainResults.found
            ? masterMedicineService.mergeWithFda(brainResults, fdaResults)
            : fdaResults;

        // Step 4: Learn new FDA data back into the Brain (fire-and-forget)
        masterMedicineService.learnFromFda(fdaResults).catch(() => {});

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "OpenFDA search results fetched successfully",
            data: mergedResults,
        });
    } catch (brainError) {
        // Fail-safe: If Brain crashes, fall back to original FDA-only flow
        console.error("[Brain] Search error, falling back to FDA:", brainError);
        const result = await openFdaService.searchDrugs(query);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "OpenFDA search results fetched successfully",
            data: result,
        });
    }
});

const getOpenFdaDetails = catchAsync(async (req, res) => {
    const id = req.query.id as string;

    // Check if it's a Brain ID
    if (id && id.startsWith("BRAIN-")) {
        const brainResult = await masterMedicineService.getById(id);
        if (brainResult) {
            return sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: "Invisible Brain drug details fetched successfully",
                data: brainResult,
            });
        }
    }

    const result = await openFdaService.fetchDrugDetails(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "OpenFDA drug details fetched successfully",
        data: result,
    });
});

const getClinicalRules = catchAsync(async (req, res) => {
    const genericName = req.query.genericName as string;
    const result = veterinaryService.findClinicalRules(genericName);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Veterinary clinical rules fetched successfully",
        data: result,
    });
});

const getOpenFdaDose = catchAsync(async (req, res) => {
    const brandName = req.query.brand as string || "";
    const genericName = req.query.generic as string || "";
    const forms = req.query.forms ? (req.query.forms as string).split(",") : [];
    const fdaRoute = req.query.route as string | undefined;

    // Try Brain first for dose rules
    const brainRules = await masterMedicineService.getDoseRules(brandName, genericName, forms, fdaRoute);
    if (brainRules && brainRules.length > 0) {
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Invisible Brain dose rules fetched successfully",
            data: brainRules,
        });
    }

    const result = await openFdaService.getDoseForDrug(brandName, genericName, forms, fdaRoute);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Drug dose rules fetched successfully",
        data: result,
    });
});

export const productController = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    calculateDosage,
    searchOpenFda,
    getOpenFdaDetails,
    getClinicalRules,
    getOpenFdaDose,
};
