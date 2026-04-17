// @ts-nocheck
import { z } from "zod";

const createSessionSchema = z.object({
  body: z.object({
    visitId: z.string(),
    petId: z.string(),
    businessBranchId: z.string(),
  }),
});

const updateConsentSchema = z.object({
  body: z.object({
    consentMethod: z.string().optional(),
    consentComments: z.string().optional(),
    consentEmail: z.string().optional(),
    consentMobile: z.string().optional(),
    standardRates: z.boolean().optional(),
  }),
});

const updatePreMedSchema = z.object({
  body: z.object({
    preMedVitals: z.object({
      wt: z.string().nullish(),
      temp: z.string().nullish(),
      hr: z.string().nullish(),
      rr: z.string().nullish(),
      mmColor: z.string().nullish(),
      hydration: z.string().nullish(),
      crt: z.string().nullish(),
    }).nullish(),
    preMedVitalsHistory: z.array(z.any()).nullish(),
    preMedMedications: z.array(
      z.object({
        id: z.number().nullish(),
        name: z.string(),
        route: z.string().nullish(),
        dose: z.string().nullish(),
        strength: z.string().nullish(),
        dosage: z.string().nullish(),
        amountToAdminister: z.string().nullish(),
        given: z.boolean().nullish(),
        time: z.string().nullish(),
        productId: z.string().nullish(),
      })
    ).nullish(),
    preMedForms: z.object({
      accessType: z.string().nullish(),
      catheter: z.string().nullish(),
      position: z.string().nullish(),
      guage: z.string().nullish(),
      administeredBy: z.string().nullish(),
    }).nullish(),
    asaStatus: z.string().nullish(),
    foodWithheld: z.string().nullish(),
    waterWithheld: z.string().nullish(),
    safetyCheckCompletedAt: z.string().nullish(), // Changed to nullish
    safetyCheckItems: z.record(z.boolean()).nullish(), // Changed to nullish
    preMedEffect: z.number().int().min(0).max(4).nullish(), // Changed to nullish
    eventLog: z.array(z.any()).nullish(),

    preMedAccumulatedTimeMs: z.number().nullish(),
    isPreMedRunning: z.boolean().nullish(),
  }),
});

const completePreMedSchema = z.object({
  body: z.object({
    preMedEffect: z.number().int().min(0).max(4).nullish(),
    asaStatus: z.string().nullish(),
    foodWithheld: z.string().nullish(),
    waterWithheld: z.string().nullish(),
    preMedVitals: z.any().nullish(),
    preMedVitalsHistory: z.array(z.any()).nullish(),
    preMedMedications: z.any().nullish(),
    preMedForms: z.any().nullish(),
    safetyCheckCompletedAt: z.string().nullish(), // Changed to nullish
    safetyCheckItems: z.record(z.boolean()).nullish(), // Changed to nullish
    eventLog: z.array(z.any()).nullish(),
  }),
});

const updateInductionSchema = z.object({
  body: z.object({
    inductionMedications: z.array(
      z.object({
        id: z.number().nullish(),
        name: z.string(),
        route: z.string().nullish(),
        dose: z.string().nullish(),
        strength: z.string().nullish(),
        dosage: z.string().nullish(),
        amountToAdminister: z.string().nullish(),
        given: z.boolean().nullish(),
        time: z.string().nullish(),
        productId: z.string().nullish(),
      })
    ).nullish(),
    inductionForms: z.object({
      intubationSize: z.string().nullish(),
      cuffed: z.string().nullish(),
      intubatedBy: z.string().nullish(),
      administeredBy: z.string().nullish(),
    }).nullish(),
    gasChecks: z.object({
      gasConnected: z.boolean().nullish(),
      gasConnectedTime: z.string().nullish(),
      gasStarted: z.boolean().nullish(),
      gasStartedTime: z.string().nullish(),
      gasStopped: z.boolean().nullish(),
      gasStoppedTime: z.string().nullish(),
    }).nullish(),
    gasChecklistApplicable: z.boolean().nullish(),
    eventLog: z.array(z.any()).nullish(),
    inductionAccumulatedTimeMs: z.number().nullish(),
    isInductionRunning: z.boolean().nullish(),
  }),
});

const monitoringEntrySchema = z.object({
  body: z.object({
    vitals: z.object({
      temp: z.string().optional(),
      hr: z.string().optional(),
      heartRhythm: z.string().optional(),
      rr: z.string().optional(),
      mmColor: z.string().optional(),
      crt: z.string().optional(),
      pulseQuality: z.string().optional(),
      aestheticDepth: z.string().optional(),
      bp: z.string().optional(),
      bpMethod: z.string().optional(),
      bpValues: z.object({
        sap: z.string().optional(),
        map: z.string().optional(),
        dap: z.string().optional(),
        directOthers: z.string().optional(),
      }).optional(),
      etco2: z.string().optional(),
      vaporizerSetting: z.string().optional(),
      o2FlowRate: z.string().optional(),
      eyePosition: z.string().optional(),
      palpebralReflex: z.string().optional(),
      jawTone: z.string().optional(),
      gaitIssue: z.string().optional(),
      gaitAbnormalities: z.array(z.string()).optional(),
    }),
    timeRange: z.string(),
    duration: z.string(),
    eventLog: z.array(z.any()).optional(),
  }),
});

export const AnesthesiaValidation = {
  createSessionSchema,
  updateConsentSchema,
  updatePreMedSchema,
  completePreMedSchema,
  updateInductionSchema,
  monitoringEntrySchema,
};