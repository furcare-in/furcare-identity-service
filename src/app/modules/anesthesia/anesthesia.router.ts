// @ts-nocheck
import express from "express";
import { AnesthesiaController } from "./anesthesia.controller.js";
import { AnesthesiaValidation } from "./anesthesia.validator.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

// Create a new anesthesia session
router.post(
    "/",
    auth(),
    validateRequest(AnesthesiaValidation.createSessionSchema),
    AnesthesiaController.createSession
);

// Get session by visit ID
router.get(
    "/visit/:visitId",
    auth(),
    AnesthesiaController.getByVisit
);

// Update consent data
router.patch(
    "/:id/consent",
    auth(),
    validateRequest(AnesthesiaValidation.updateConsentSchema),
    AnesthesiaController.updateConsent
);

// Save Pre-Medication data
router.patch(
    "/:id/pre-medication",
    auth(),
    validateRequest(AnesthesiaValidation.updatePreMedSchema),
    AnesthesiaController.updatePreMed
);

// Start Pre-Medication timer
router.patch(
    "/:id/pre-medication/start",
    auth(),
    AnesthesiaController.startPreMedTimer
);

// Complete Pre-Medication
router.patch(
    "/:id/pre-medication/complete",
    auth(),
    validateRequest(AnesthesiaValidation.completePreMedSchema),
    AnesthesiaController.completePreMed
);

// Save Induction data
router.patch(
    "/:id/induction",
    auth(),
    validateRequest(AnesthesiaValidation.updateInductionSchema),
    AnesthesiaController.updateInduction
);

// Start Induction timer
router.patch(
    "/:id/induction/start",
    auth(),
    AnesthesiaController.startInductionTimer
);

// Complete Induction
router.patch(
    "/:id/induction/complete",
    auth(),
    AnesthesiaController.completeInduction
);

// Add monitoring entry
router.post(
    "/:id/monitoring",
    auth(),
    validateRequest(AnesthesiaValidation.monitoringEntrySchema),
    AnesthesiaController.addMonitoringEntry
);

// Complete entire session
router.patch(
    "/:id/complete",
    auth(),
    AnesthesiaController.completeSession
);

export const anesthesiaRouter = router;
