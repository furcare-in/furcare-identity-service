// @ts-nocheck
import prisma from "../../../utils/prisma.js";

// Create a new draft session
const createSession = async (data: {
  visitId: string;
  petId: string;
  businessBranchId: string;
}) => {
  return prisma.anesthesiaSession.create({ data });
};

// Get session by visit ID
const getSessionByVisit = async (visitId: string) => {
  return prisma.anesthesiaSession.findFirst({
    where: { visitId: Number(visitId) },
  });
};

// Get session by ID
const getSessionById = async (id: string) => {
  return prisma.anesthesiaSession.findUnique({
    where: { id: Number(id) },
  });
};

// Update consent tab data
const updateConsent = async (
  id: string,
  data: {
    consentMethod?: string;
    consentComments?: string;
    consentEmail?: string;
    consentMobile?: string;
    standardRates?: boolean;
  }
) => {
  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data,
  });
};

// Save Pre-Medication data (vitals, medications, forms, assessment, history, safety)
const updatePreMedication = async (
  id: string,
  data: {
    preMedVitals?: any;
    preMedMedications?: any;
    preMedForms?: any;
    preMedVitalsHistory?: any;
    asaStatus?: string;
    foodWithheld?: string;
    waterWithheld?: string;
    safetyCheckCompletedAt?: string; // ISO string, will be converted to Date
    safetyCheckItems?: any;
    preMedEffect?: number;
    eventLog?: any[];
    preMedAccumulatedTimeMs?: number;
    isPreMedRunning?: boolean;
  }
) => {
  // Fetch existing session to merge JSON fields
  const existingSession = await prisma.anesthesiaSession.findUnique({
    where: { id: Number(id) },
  });

  if (!existingSession) {
    throw new Error("Anesthesia session not found");
  }

  const updateData: any = {};

  // Simple field updates
  if (data.asaStatus !== undefined) updateData.asaStatus = data.asaStatus;
  if (data.foodWithheld !== undefined) updateData.foodWithheld = data.foodWithheld;
  if (data.waterWithheld !== undefined) updateData.waterWithheld = data.waterWithheld;
  if (data.preMedEffect !== undefined) updateData.preMedEffect = data.preMedEffect;
  if (data.preMedAccumulatedTimeMs !== undefined) updateData.preMedAccumulatedTimeMs = data.preMedAccumulatedTimeMs;
  if (data.isPreMedRunning !== undefined) updateData.isPreMedRunning = data.isPreMedRunning;
  if (data.safetyCheckCompletedAt) updateData.safetyCheckCompletedAt = new Date(data.safetyCheckCompletedAt);
  if (data.eventLog) updateData.eventLog = data.eventLog;

  // JSON fields - Merge logic
  if (data.preMedVitals) {
    updateData.preMedVitals = {
      ...(existingSession.preMedVitals as any || {}),
      ...data.preMedVitals,
    };
  }

  if (data.preMedMedications) {
    // Medications are usually replaced as a whole list
    updateData.preMedMedications = data.preMedMedications;
  }

  if (data.preMedVitalsHistory) {
    updateData.preMedVitalsHistory = data.preMedVitalsHistory;
  }

  if (data.safetyCheckItems) {
    updateData.safetyCheckItems = {
      ...(existingSession.safetyCheckItems as any || {}),
      ...data.safetyCheckItems,
    };
  }

  if (data.preMedForms) {
    const mergedForms = {
      ...(existingSession.preMedForms as any || {}),
      ...data.preMedForms,
    };

    // Transform frontend 'administeredBy' name to 'administeredByName'
    if (data.preMedForms.administeredBy) {
      mergedForms.administeredByName = data.preMedForms.administeredBy;
      delete mergedForms.administeredBy;
    }

    updateData.preMedForms = mergedForms;
  }

  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

// Start Pre-Medication timer
const startPreMedTimer = async (id: string) => {
  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: {
      preMedStartedAt: new Date(),
      status: "in_progress",
      currentPhase: "preMedication",
    },
  });
};

// Complete Pre-Medication phase
const completePreMed = async (
  id: string,
  preMedEffect: number | string,
  restData: {
    preMedVitals?: any;
    preMedMedications?: any;
    preMedForms?: any;
    preMedVitalsHistory?: any;
    asaStatus?: string;
    foodWithheld?: string;
    waterWithheld?: string;
    safetyCheckCompletedAt?: string;
    safetyCheckItems?: any;
  }
) => {
  // First save any remaining data
  await updatePreMedication(id, restData);

  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: {
      preMedEffect: typeof preMedEffect === 'string' ? parseInt(preMedEffect, 10) : preMedEffect,
      preMedCompletedAt: new Date(),
      currentPhase: "induction",
    },
  });
};

// Save Induction data (medications, forms, gas checks)
const updateInduction = async (
  id: string,
  data: {
    inductionMedications?: any;
    inductionForms?: any;
    gasChecks?: any;
    gasChecklistApplicable?: boolean;
    eventLog?: any[];
    inductionAccumulatedTimeMs?: number;
    isInductionRunning?: boolean;
  }
) => {
  // Fetch existing session to merge JSON fields
  const existingSession = await prisma.anesthesiaSession.findUnique({
    where: { id: Number(id) },
  });

  if (!existingSession) {
    throw new Error("Anesthesia session not found");
  }

  const updateData: any = {};

  // Simple field updates
  if (data.gasChecklistApplicable !== undefined) updateData.gasChecklistApplicable = data.gasChecklistApplicable;
  if (data.inductionAccumulatedTimeMs !== undefined) updateData.inductionAccumulatedTimeMs = data.inductionAccumulatedTimeMs;
  if (data.isInductionRunning !== undefined) updateData.isInductionRunning = data.isInductionRunning;
  if (data.eventLog) updateData.eventLog = data.eventLog;

  // JSON fields - Merge logic
  if (data.inductionMedications) {
    updateData.inductionMedications = data.inductionMedications;
  }

  if (data.gasChecks) {
    updateData.gasChecks = {
      ...(existingSession.gasChecks as any || {}),
      ...data.gasChecks,
    };
  }

  if (data.inductionForms) {
    const mergedForms = {
      ...(existingSession.inductionForms as any || {}),
      ...data.inductionForms,
    };

    // Transform names
    if (data.inductionForms.intubatedBy) {
      mergedForms.intubatedByName = data.inductionForms.intubatedBy;
      delete mergedForms.intubatedBy;
    }
    if (data.inductionForms.administeredBy) {
      mergedForms.administeredByName = data.inductionForms.administeredBy;
      delete mergedForms.administeredBy;
    }

    updateData.inductionForms = mergedForms;
  }

  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

// Start Induction timer
const startInductionTimer = async (id: string) => {
  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: {
      inductionStartedAt: new Date(),
      currentPhase: "induction",
    },
  });
};

// Complete Induction phase
const completeInduction = async (id: string) => {
  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: {
      inductionCompletedAt: new Date(),
      currentPhase: "monitoring",
    },
  });
};

// Add a monitoring entry (append to array)
const addMonitoringEntry = async (id: string, entry: any, eventLog?: any[]) => {
  const session = await prisma.anesthesiaSession.findUnique({
    where: { id: Number(id) },
    select: { monitoringEntries: true },
  });

  const existingEntries = (session?.monitoringEntries as any[]) || [];
  const updatedEntries = [...existingEntries, entry];

  const updateData: any = { monitoringEntries: updatedEntries };
  if (eventLog) {
    updateData.eventLog = eventLog;
  }

  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

// Complete entire session
const completeSession = async (id: string) => {
  return prisma.anesthesiaSession.update({
    where: { id: Number(id) },
    data: {
      status: "completed",
    },
  });
};

export const AnesthesiaService = {
  createSession,
  getSessionByVisit,
  getSessionById,
  updateConsent,
  updatePreMedication,
  startPreMedTimer,
  completePreMed,
  updateInduction,
  startInductionTimer,
  completeInduction,
  addMonitoringEntry,
  completeSession,
};