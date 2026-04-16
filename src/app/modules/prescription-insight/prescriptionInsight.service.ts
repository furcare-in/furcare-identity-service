import prisma from "../../../utils/prisma.js";
import { masterMedicineService } from "../master-medicine/masterMedicine.service.js";

/**
 * Service to handle Layer 3 (Clinical Behavior) and Layer 4 (Learning Observations)
 */

interface PrescriptionPayload {
    name: string;      // What the doctor wrote or selected (usually Brand or Generic)
    dose?: string;     // e.g., "12 mg"
    doseUnit?: string; // e.g., "mg/kg"
    route?: string;    // e.g., "Oral"
    frequency?: string;// e.g., "BID"
    form?: string;     // e.g., "Tablet"
    species?: string;
}

const processVisitPrescriptions = async (visit: any) => {
    try {
        if (!visit || !visit.prescriptions || !Array.isArray(visit.prescriptions) || visit.prescriptions.length === 0) {
            return;
        }

        const doctorId = visit.author || null; // Visit author is usually the doctor ID
        const branchId = visit.businessBranchId;

        for (const rx of visit.prescriptions) {
            if (!rx.name) continue;

            const nameStr = rx.name.trim();
            const normalizedGeneric = masterMedicineService.normalizeGenericName(nameStr);
            if (!normalizedGeneric) continue;

            // 1. Try to find the MasterMedicine
            const masterMed = await prisma.masterMedicine.findFirst({
                where: {
                    OR: [
                        { genericNameLower: normalizedGeneric },
                        { name: { equals: nameStr, mode: "insensitive" } },
                        { synonyms: { has: nameStr } }
                    ]
                }
            });

            const genericName = masterMed?.genericName || nameStr;
            const medicineId = masterMed?.id || null;

            // 2. Extract numeric dosing if possible (simplistic extraction for now)
            let minDose = null;
            let maxDose = null;
            if (rx.dose) {
                const match = String(rx.dose).match(/(\d+\.?\d*)/g);
                if (match && match.length >= 1) {
                    minDose = parseFloat(match[0]);
                    maxDose = match.length > 1 ? parseFloat(match[1]) : minDose;
                }
            }

            // 3. Store Layer 3: PrescriptionInsight
            const insight = await prisma.prescriptionInsight.create({
                data: {
                    medicineId,
                    genericName,
                    brandName: nameStr !== genericName ? nameStr : null,
                    doctorId,
                    visitId: visit.id,
                    businessBranchId: branchId,
                    minDoseMgPerKg: minDose,
                    maxDoseMgPerKg: maxDose,
                    doseUnit: rx.doseUnit || undefined,
                    route: rx.route || undefined,
                    frequency: rx.frequency || undefined,
                    form: rx.form || undefined,
                    species: rx.species || visit.pet?.animalClass?.name || undefined,
                }
            });

            // 4. Store Layer 4: Observations (Missing or Conflicting Knowledge)
            // If the Brain doesn't know about this route, form, etc., we log it as an observation.
            // Even if it knows, logging provides "confirmations" for consensus algorithms later.
            if (medicineId) {
                const observationsToCreate = [];
                const conf = 0.75; // Doctor prescription confidence

                if (insight.route) {
                    observationsToCreate.push({
                        medicineId,
                        genericName,
                        fieldName: "route",
                        fieldValue: insight.route.trim().toLowerCase(),
                        source: "doctor",
                        sourceId: doctorId,
                        confidence: conf,
                        businessBranchId: branchId,
                    });
                }

                if (insight.form) {
                    observationsToCreate.push({
                        medicineId,
                        genericName,
                        fieldName: "form",
                        fieldValue: insight.form.trim().toLowerCase(),
                        source: "doctor",
                        sourceId: doctorId,
                        confidence: conf,
                        businessBranchId: branchId,
                    });
                }

                if (observationsToCreate.length > 0) {
                    await prisma.medicineObservation.createMany({
                        data: observationsToCreate
                    });
                }
            }
        }
    } catch (error) {
        console.error("[Analytics] Error processing visit prescriptions:", error);
    }
};

export const prescriptionInsightService = {
    processVisitPrescriptions
};
