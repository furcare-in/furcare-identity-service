// @ts-nocheck
import express from "express";
import { VisitController } from "./visit.controller.js";
import { VisitValidation } from "./visit.validator.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
    "/",
    auth(),
    validateRequest(VisitValidation.createVisitSchema),
    VisitController.createVisit
);

router.get(
    "/",
    auth(),
    VisitController.getVisits
);

// Medical notes routes (used by frontend)
router.post(
    "/medical-notes/:petId",
    auth(),
    VisitController.createVisit  // Reuse createVisit for now
);

router.patch(
    "/medical-notes/bulk-update",
    auth(),
    VisitController.updateVisit  // Reuse updateVisit for now
);

router.get(
    "/medical-notes/:petId",
    auth(),
    VisitController.getPatientInfo
);

router.get(
    "/medical-records",
    auth(),
    VisitController.getVisits  // Reuse getVisits
);

router.post(
    "/medical-records/ai-autofill",
    auth(),
    validateRequest(VisitValidation.aiAutofillSchema),
    VisitController.aiAutofillMedicalRecord
);

router.get(
    "/medical-record/:id",
    auth(),
    VisitController.getVisit  // Reuse getVisit
);

router.get(
    "/:id",
    auth(),
    VisitController.getVisit
);

router.patch(
    "/:id",
    auth(),
    validateRequest(VisitValidation.updateVisitSchema),
    VisitController.updateVisit
);

router.delete(
    "/:id",
    auth(),
    VisitController.deleteVisit
);

export const visitRouter = router;
