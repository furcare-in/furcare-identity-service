// @ts-nocheck
// external-api/openfda.service.ts
// NOTE: veterinaryService (hardcoded KB) dependency REMOVED.
// Dose rules now come exclusively from FDA API NLP extraction.
import dns from 'dns';
import prisma from "../../../utils/prisma.js";

// Fix Node.js 18+ undici (fetch) IPv6 connect timeouts when routing fails
dns.setDefaultResultOrder('ipv4first');

// Interfaces
interface StrengthVariant {
    strength: number | null;
    unit: string | null;
    form: string | null;
}

interface SafetyWarning {
    type: string;
    text: string;
}

interface OpenFdaDrugDetails {
    name: string | null;
    genericName: string | null;
    description: string | null;
    variants: StrengthVariant[];
    route: string | null;
    safetyWarnings: SafetyWarning[];
    hasClinicalReference: boolean;
}

// Constants
const OPENFDA_API_URL = "https://api.fda.gov/drug/label.json";

// Standard veterinary species weights for human-label conversions
const SPECIES_WEIGHTS_KG: Record<string, number> = {
    Canine: 25,
    Feline: 4.5,
    Equine: 450,
    Rabbit: 2.5,
    Avian: 0.3
};

/**
 * Fetch with retry and timeout
 */
const fetchWithRetry = async (url: string, retries = 2): Promise<any> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
            return await response.json();
        } catch (error) {
            if (attempt === retries) throw error;
            await new Promise(r => setTimeout(r, 1000));
        }
    }
};

/**
 * Parse a single dosage_forms_and_strengths entry
 * Extracts strength, unit, and form
 * Returns null if parsing fails
 */
const parseVariantEntry = (entry: string): StrengthVariant | null => {
    if (!entry || typeof entry !== 'string') return null;

    const text = entry.trim().toUpperCase();

    // First, extract form
    const formPatterns: Record<string, RegExp> = {
        'Tablet': /\b(TABLETS?|TABLET)\b/,
        'Bolus': /\b(BOLUS(ES)?)\b/,
        'Capsule': /\b(CAPSULES?|CAPSULE)\b/,
        'Suspension': /\b(SUSPENSION|ORAL SOLUTION|SYRUP|ELIXIR)\b/,
        'Injectable': /\b(INJECTION|INJECTABLE)\b/,
        'Vial': /\b(VIALS?|VIAL)\b/,
        'Solution': /\b(SOLUTIONS?|SOLUTION)\b/,
        'Drops': /\b(DROPS|DROP)\b/,
        'Cream': /\b(CREAMS?|CREAM)\b/,
        'Ointment': /\b(OINTMENTS?|OINTMENT)\b/,
        'Patch': /\b(PATCHES?|PATCH|TRANSDERMAL)\b/,
        'Inhaler': /\b(INHALERS?|INHALER|INHALATION)\b/,
        'Powder': /\b(POWDERS?|POWDER)\b/,
        'Gel': /\b(GELS?|GEL)\b/,
        'Lotion': /\b(LOTIONS?|LOTION)\b/,
        'Spray': /\b(SPRAYS?|SPRAY)\b/,
        'Suppository': /\b(SUPPOSITORIES?|SUPPOSITORY)\b/
    };

    let form: string | null = null;
    for (const [formName, pattern] of Object.entries(formPatterns)) {
        if (pattern.test(text)) {
            // Force precise form selection instead of grouping "Injection" and "Injectable" too aggressively
            if (formName === "Injectable" && text.includes("INJECTION") && !text.includes("INJECTABLE")) {
                form = "Injection";
            } else {
                form = formName;
            }
            break;
        }
    }

    // Pattern 1: Concentration or simple format "1 G / 10 ML" or "500 MG"
    // Captures (number) (unit) and optionally / (number) (unit)
    const strengthPattern = /(\d+(?:\.\d+)?)\s*(MG|G|ML|MCG|IU|UNITS?)(?:\s*\/\s*(\d+(?:\.\d+)?)\s*(ML|L|MG|G|UNITS?))?/i;
    const match = text.match(strengthPattern);

    if (match) {
        let strengthValue = parseFloat(match[1]);
        let strengthUnit = match[2].toLowerCase();

        const volumeValue = match[3] ? parseFloat(match[3]) : null;
        const volumeUnit = match[4] ? match[4].toLowerCase() : null;

        // If it's a concentration (e.g. 1G/10ML), we simplify to the primary strength (1000mg)
        // because the UI usually expects a single strength value.
        // Normalize grams to mg
        if (strengthUnit === 'g') {
            strengthValue = strengthValue * 1000;
            strengthUnit = 'mg';
        }

        return {
            strength: strengthValue,
            unit: strengthUnit,
            form
        };
    }

    if (form) {
        return { strength: null, unit: null, form };
    }

    return null;
};

/**
 * Fallback: Extract strength from title or description text
 */
const extractStrengthFromText = (text: string): { strength: number | null, unit: string | null } => {
    if (!text) return { strength: null, unit: null };

    const pattern = /(\d+(?:\.\d+)?)\s*(MG|G|MCG|IU|UNITS?)\b/i;
    const match = text.match(pattern);

    if (match) {
        let val = parseFloat(match[1]);
        let unit = match[2].toLowerCase();
        if (unit === 'g') {
            val *= 1000;
            unit = 'mg';
        }
        return { strength: val, unit: unit };
    }
    return { strength: null, unit: null };
};

/**
 * Parse all dosage_forms_and_strengths entries
 */
const parseStrengthVariants = (forms: string[]): StrengthVariant[] => {
    if (!Array.isArray(forms) || forms.length === 0) return [];

    const variants: StrengthVariant[] = [];
    for (const entry of forms) {
        const variant = parseVariantEntry(entry);
        if (variant) variants.push(variant);
    }

    const seen = new Set<string>();
    return variants.filter(v => {
        const key = `${v.strength}-${v.unit}-${v.form}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

/**
 * Search OpenFDA (ANIMAL DRUG ONLY)
 */
const normalizeFormName = (rawForm: string): string => {
    const mappings: Record<string, string> = {
        'tablets': 'Tablet',
        'tablet': 'Tablet',
        'tab': 'Tablet',
        'capsules': 'Capsule',
        'capsule': 'Capsule',
        'cap': 'Capsule',
        'suspension': 'Suspension',
        'susp': 'Suspension',
        'solution': 'Solution',
        'soln': 'Solution',
        'injection': 'Injection',
        'injectable': 'Injectable',
        'inj': 'Injection',
        'vial': 'Vial',
        'bottle': 'Bottle',
        'cream': 'Cream',
        'ointment': 'Ointment',
        'oint': 'Ointment',
        'gel': 'Gel',
        'drops': 'Drops',
        'powder': 'Powder',
        'powd': 'Powder',
        'patch': 'Patch',
        'inhaler': 'Inhaler',
        'spray': 'Spray',
        'suppository': 'Suppository',
        'supp': 'Suppository',
        'liquid': 'Liquid',
        'ml': 'Liquid',
        'shampoo': 'Shampoo',
        'lotion': 'Lotion',
        'granules': 'Granules',
        'paste': 'Paste',
        'chewable': 'Chewable',
        'bolus': 'Bolus'
    };
    const normalized = rawForm.toLowerCase().trim();

    if (mappings[normalized]) return mappings[normalized];

    for (const [key, value] of Object.entries(mappings)) {
        if (normalized.includes(key)) return value;
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/**
 * Infer dosage form from therapeutic route
 * Targets drugs like Cefoxitin (IV/IM -> Injection)
 */
const inferFormFromRoute = (route: string): string[] => {
    if (!route) return [];
    const upper = route.toUpperCase();

    if (
        upper.includes("INTRAVENOUS") ||
        upper.includes("INTRAMUSCULAR") ||
        upper.includes("SUBCUTANEOUS") ||
        upper.includes("INJECTION")
    ) {
        return ["Injection", "Injectable"];
    }

    if (upper.includes("OPHTHALMIC")) return ["Drops"];
    if (upper.includes("INHALATION")) return ["Inhaler"];
    if (upper.includes("TRANSDERMAL")) return ["Patch"];
    if (upper.includes("TOPICAL")) return ["Topical"];
    if (upper.includes("ORAL")) return ["Oral"];

    return [];
};

/**
 * Extract forms from raw text using regex patterns
 */
const extractFormsFromText = (text: string): string[] => {
    if (!text) return [];
    const sample = text.slice(0, 1500).toLowerCase();

    const patterns = [
        { regex: /\btablets?\b/i, form: "Tablet" },
        { regex: /\bbolus(es)?\b/i, form: "Bolus" },
        { regex: /\bcapsules?\b/i, form: "Capsule" },
        { regex: /\bsuspension\b/i, form: "Suspension" },
        { regex: /\bsolution\b/i, form: "Solution" },
        { regex: /\binjection\b/i, form: "Injection" },
        { regex: /\binj\.?\b/i, form: "Injection" },
        { regex: /\binjectable\b/i, form: "Injectable" },
        { regex: /\bsyrup\b/i, form: "Syrup" },
        { regex: /\belixir\b/i, form: "Elixir" },
        { regex: /\bliquid\b/i, form: "Liquid" },
        { regex: /\bcream\b/i, form: "Cream" },
        { regex: /\bointment\b/i, form: "Ointment" },
        { regex: /\bgel\b/i, form: "Gel" },
        { regex: /\bdrops\b/i, form: "Drops" },
        { regex: /\bpowder\b/i, form: "Powder" },
        { regex: /\bspray\b/i, form: "Spray" },
        { regex: /\binhaler\b/i, form: "Inhaler" },
        { regex: /\bpatch\b/i, form: "Patch" }
    ];

    const found = new Set<string>();
    patterns.forEach(p => {
        if (p.regex.test(sample)) found.add(p.form);
    });

    return Array.from(found);
};

/**
 * Parse frequency from text
 */
const parseFrequency = (text: string): string => {
    if (/\b(once a day|once daily|sid|q24h|every 24 hours)\b/i.test(text)) return "SID";
    if (/\b(twice a day|twice daily|bid|q12h|every 12 hours)\b/i.test(text)) return "BID";
    if (/\b(three times a day|tid|q8h|every 8 hours)\b/i.test(text)) return "TID";
    if (/\b(four times a day|qid|q6h|every 6 hours)\b/i.test(text)) return "QID";
    if (/\b(every 4 to 6 hours|q4-6h)\b/i.test(text)) return "Q4-6H";
    return "";
};

/**
 * Try to extract a weight-based (mg/kg) dose from Animal Drug API text.
 * Returns structured rule or null.
 */
const extractWeightBasedRule = (text: string, forms: string[], fdaRoute?: string): any | null => {
    if (!text) return null;
    const sample = text.slice(0, 4000).toLowerCase();

    // Expanded patterns for weight-based dosing
    const rangePatterns = [
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*\/\s*kg/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*per\s*kg/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*per\s*kilogram/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*(mg|ml|mcg|iu)\/kg/i
    ];
    const singlePatterns = [
        /(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*\/\s*kg/i,
        /(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*per\s*kg/i,
        /(\d+\.?\d*)\s*(mg|ml|mcg|iu)\s*per\s*kilogram/i
    ];

    let minD = 0, maxD = 0, unit = "mg/kg";

    for (const pattern of rangePatterns) {
        const m = sample.match(pattern);
        if (m) {
            minD = parseFloat(m[1]);
            maxD = parseFloat(m[2]);
            unit = `${m[3].toLowerCase()}/kg`;
            break;
        }
    }

    if (minD === 0) {
        for (const pattern of singlePatterns) {
            const m = sample.match(pattern);
            if (m) {
                // Single value — keep only unit, leave doses at 0 for manual entry
                unit = `${m[2].toLowerCase()}/kg`;
                break;
            }
        }
    }

    const frequency = parseFrequency(sample);
    const route = fdaRoute || inferRouteFromForms(forms);

    // If mg/lb, convert to mg/kg
    if (unit === 'mg/lb') {
        minD = Number((minD * 2.20462).toFixed(2));
        maxD = Number((maxD * 2.20462).toFixed(2));
        unit = 'mg/kg';
    }

    if (minD > 0) {
        return {
            species: "All Species", minDoseMgPerKg: minD, maxDoseMgPerKg: maxD,
            doseUnit: unit, frequency: frequency || "PRN", route, instructions: "Auto-extracted from FDA Animal Drug label.",
            doseSource: "FDA_ANIMAL", doseWarning: null
        };
    }

    // Returned with 0s so Yellow Banner shows (unit was found)
    return {
        species: "All Species", minDoseMgPerKg: 0, maxDoseMgPerKg: 0,
        doseUnit: unit, frequency: frequency || "", route, instructions: "",
        doseSource: "FDA_ANIMAL", doseWarning: null
    };
};

/**
 * Extract a flat mg dose from Human Drug API and convert to mg/kg using species body weight.
 * Returns a converted rule with a HUMAN_CONVERTED warning, or null if not found.
 */
const extractConvertedHumanRule = (text: string, forms: string[], fdaRoute?: string): any | null => {
    if (!text) return null;
    const sample = text.slice(0, 6000).toLowerCase();

    // Priority 1: Inline mg dose range (e.g. "300 to 600 mg daily")
    const inlineRangePatterns = [
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*mg\s*(?:once|twice|daily|per day|orally|iv|im|sc|tid|bid|qd|sid|\b)/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*mg\/day/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*mg\s*per\s*day/i,
        /(\d+\.?\d*)\s*(?:to|-|and)\s*(\d+\.?\d*)\s*mg/i
    ];

    // Priority 2: Table-style dose range with mg/day in headers (e.g. FDA dosing tables)
    // Matches ranges like "900 to 3600" when near words "dose", "daily", "total"
    const tableRangePatterns = [
        /daily\s*dose[^.]{0,60}?(\d{3,})\s*(?:to|-)\s*(\d{3,})/i,
        /(\d{3,})\s*(?:to|-)\s*(\d{3,})\s*(?:mg|daily|total|dose)/i,
        /total\s*daily[^.]{0,60}?(\d{3,})\s*(?:to|-)\s*(\d{3,})/i,
    ];

    let humanMin = 0, humanMax = 0;

    // Try inline patterns first
    for (const pattern of inlineRangePatterns) {
        const m = sample.match(pattern);
        if (m) {
            const a = parseFloat(m[1]);
            const b = parseFloat(m[2]);
            if (a > 10000 || b > 10000) continue;
            if (b <= a) continue;
            // Relax gap for low-dose drugs (e.g. Terazosin 1-10mg)
            // If max dose is small (< 50mg), any gap is fine.
            // Only enforce 50mg gap for larger doses to avoid matching strengths.
            if (b >= 50 && (b - a) < 50 && b < 500) continue;
            humanMin = a;
            humanMax = b;
            break;
        }
    }

    // New Priority 1.5: Single dose value (e.g. "10 mg once daily")
    const singleDosePatterns = [
        /(?:initial|starting|maintenance|total|dosage?)\s*(?:is|of)?\s*(\d+\.?\d*)\s*mg\s*(?:once|twice|daily|per day|orally|iv|im|sc|tid|bid|qd|sid)/i,
        /(\d+\.?\d*)\s*mg\s*(?:once|twice|daily|per day|orally|iv|im|sc|tid|bid|qd|sid)/i
    ];

    if (humanMin === 0) {
        for (const pattern of singleDosePatterns) {
            const m = sample.match(pattern);
            if (m) {
                const val = parseFloat(m[1]);
                if (val > 0 && val < 5000) {
                    humanMin = val;
                    humanMax = val;
                    break;
                }
            }
        }
    }

    // Fallback: scan for table-style dose ranges
    if (humanMin === 0 || humanMax === 0) {
        for (const pattern of tableRangePatterns) {
            const m = sample.match(pattern);
            if (m) {
                const a = parseFloat(m[1]);
                const b = parseFloat(m[2]);
                if (a > 10000 || b > 10000) continue;
                if (b <= a) continue;
                if ((b - a) < 100) continue; // Table ranges are usually wide
                humanMin = a;
                humanMax = b;
                break;
            }
        }
    }

    if (humanMin === 0 || humanMax === 0) return null;


    const dogWeight = SPECIES_WEIGHTS_KG.Canine;
    const catWeight = SPECIES_WEIGHTS_KG.Feline;
    const frequency = parseFrequency(sample);
    const route = fdaRoute || inferRouteFromForms(forms);

    // Return two rules: one for dog, one for cat
    return [
        {
            species: "Canine",
            minDoseMgPerKg: Number((humanMin / dogWeight).toFixed(3)),
            maxDoseMgPerKg: Number((humanMax / dogWeight).toFixed(3)),
            doseUnit: "mg/kg", frequency: frequency || "PRN", route,
            instructions: `Converted from human flat dose (${humanMin}–${humanMax}mg ÷ ${dogWeight}kg).`,
            doseSource: "HUMAN_CONVERTED",
            doseWarning: "Dose converted from human label. Verify with a veterinary reference before prescribing."
        },
        {
            species: "Feline",
            minDoseMgPerKg: Number((humanMin / catWeight).toFixed(3)),
            maxDoseMgPerKg: Number((humanMax / catWeight).toFixed(3)),
            doseUnit: "mg/kg", frequency: frequency || "PRN", route,
            instructions: `Converted from human flat dose (${humanMin}–${humanMax}mg ÷ ${catWeight}kg).`,
            doseSource: "HUMAN_CONVERTED",
            doseWarning: "Dose converted from human label. Verify with a veterinary reference before prescribing."
        }
    ];
};

/**
 * Helper to infer route from dispensable forms
 */
const inferRouteFromForms = (forms: string[]): string => {
    if (forms.includes("Injection") || forms.includes("Injectable") || forms.includes("Vial")) return "IV";
    if (forms.includes("Tablet") || forms.includes("Capsule") || forms.includes("Suspension") || forms.includes("Syrup") || forms.includes("Liquid")) return "PO";
    if (forms.includes("Ointment") || forms.includes("Cream") || forms.includes("Gel")) return "Topical";
    if (forms.includes("Drops")) return "Ophthalmic";
    if (forms.includes("Inhaler") || forms.includes("Spray")) return "Inhalation";
    return "";
};

/**
 * Dual-API Dose Extraction:
 * 1. Try animal_drug API first (HIGH precision) — tries brand name, then generic name
 * 2. Fallback to human drug API with weight conversion (MEDIUM precision)
 */
const fetchDualApiDose = async (drugName: string, forms: string[], fdaRoute?: string, genericName?: string): Promise<any[] | null> => {
    const sanitized = drugName.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const sanitizedGeneric = genericName ? genericName.replace(/[^a-zA-Z0-9 ]/g, "").trim() : "";

    // Build list of search terms to try: brand name first, then generic name
    const searchTerms = [sanitized];
    if (sanitizedGeneric && sanitizedGeneric.toLowerCase() !== sanitized.toLowerCase()) {
        searchTerms.push(sanitizedGeneric);
    }

    // PRIORITY 1: FDA Animal Drug API — try each name
    for (const term of searchTerms) {
        if (!term) continue;
        try {
            // Animal drugs are just in the regular endpoint but with product_type:"ANIMAL DRUG"
            const animalUrl = `${OPENFDA_API_URL}?search=(openfda.brand_name:${term}*+OR+openfda.generic_name:${term}*)&limit=1`;
            const animalData = await fetchWithRetry(animalUrl);
            const animalRes = animalData?.results?.[0];

            if (animalRes) {
                const textToAnalyze = [
                    animalRes.dosage_and_administration?.[0],
                    animalRes.indications_and_usage?.[0]
                ].filter(Boolean).join(" ");

                const animalRoute = fdaRoute || animalRes.openfda?.route?.[0];
                const animalRule = extractWeightBasedRule(textToAnalyze, forms, animalRoute);
                if (animalRule && animalRule.minDoseMgPerKg > 0) {
                    console.log(`[FDA_ANIMAL] Found dosing for ${term}`);
                    return [animalRule];
                }
            }
        } catch (e) {
            console.warn(`[FDA_ANIMAL] Error fetching ${term}:`, e);
        }
    }

    // PRIORITY 2: FDA Human Drug API with conversion — try each name
    for (const term of searchTerms) {
        if (!term) continue;
        try {
            const humanUrl = `${OPENFDA_API_URL}?search=(openfda.brand_name:${term}*+OR+openfda.generic_name:${term}*)&limit=1`;
            const humanData = await fetchWithRetry(humanUrl);
            const humanRes = humanData?.results?.[0];

            if (humanRes) {
                const textToAnalyze = [
                    humanRes.dosage_and_administration?.[0],
                    humanRes.indications_and_usage?.[0]
                ].filter(Boolean).join(" ");

                const humanRoute = fdaRoute || humanRes.openfda?.route?.[0];

                // First try: maybe human label also has mg/kg data
                const weightBasedRule = extractWeightBasedRule(textToAnalyze, forms, humanRoute);
                if (weightBasedRule && weightBasedRule.minDoseMgPerKg > 0) {
                    console.log(`[HUMAN_WEIGHT_BASED] Found mg/kg dosing for ${term}`);
                    weightBasedRule.doseSource = "HUMAN_WEIGHT_BASED";
                    return [weightBasedRule];
                }

                // Fallback: convert flat mg dose
                const convertedRules = extractConvertedHumanRule(textToAnalyze, forms, humanRoute);
                if (convertedRules && convertedRules.length > 0) {
                    console.log(`[HUMAN_CONVERTED] Converted flat dose for ${term}`);
                    return convertedRules;
                }
            }
        } catch (e) {
            console.warn(`[HUMAN_API] Error fetching ${term}:`, e);
        }
    }

    return null;
};

/**
 * Smart NLP/Regex Extraction for Clinical Dosing Rules (LEGACY - kept for single-call use)
 */
const extractDosingRulesFromText = (text: string, forms: string[], fdaRoute?: string) => {
    return extractWeightBasedRule(text, forms, fdaRoute);
};

/**
 * Controlled Merge Strategy for dosage form discovery
 */
const extractFormsWithFallback = (res: any): string[] => {
    const forms = new Set<string>();

    const rawForms = res.dosage_forms_and_strengths || [];
    rawForms.forEach((f: string) => forms.add(normalizeFormName(f)));

    const route = res.openfda?.route?.[0];
    if (route) {
        inferFormFromRoute(route).forEach(f => forms.add(f));
    }

    if (forms.size === 0 || forms.has("Oral") || forms.has("Topical")) {
        const textToParse = [
            res.description?.[0],
            res.dosage_and_administration?.[0],
            res.indications_and_usage?.[0]
        ].filter(Boolean).join(" ");

        extractFormsFromText(textToParse).forEach(f => forms.add(f));
    }

    if (forms.size > 1) {
        forms.delete("Oral");
        forms.delete("Topical");
    }

    if (forms.size === 0) forms.add("Other"); // Catch-all so nothing is ever blocked

    return Array.from(forms);
};

// Phase 1 Configuration: Veterinary Drug Scoring System
const VET_CROSSOVER_CONFIG = {
    // Bucket B: Manual guarantee list (THE FIX)
    drugs: [
        // Analgesics/Anti-inflammatories
        'CARPROFEN', 'RIMADYL', 'NOVOCOX', 'VETPROFEN', 'QUELLIN',
        'MELOXICAM', 'METACAM', 'LOXICOM', 'ONSIOR', 'PREVICOX',
        'FIROCOXIB', 'DERACOXIB', 'DERAMAXX', 'ROBENACOXIB',
        'GRAPIPRANT', 'GALLIPRANT',
        'GABAPENTIN', 'NEURONTIN', 'PREGABALIN', 'LYRICA',
        'TRAMADOL', 'ULTRAM', 'AMANTADINE', 'METHOCARBAMOL',

        // Cephalosporins & Penicillins
        'CEPHALEXIN', 'KEFLEX', 'RILEXINE',
        'CEFOXITIN', 'MEFOXIN',
        'CEFTRIAXONE', 'ROCEPHIN',
        'CEFOVECIN', 'CONVENIA',
        'CEFPODOXIME', 'SIMPLICEF',
        'CEFAZOLIN', 'ANCEF',
        'AMOXICILLIN', 'AMOXIL', 'MOXATAG',
        'AMOXICILLIN CLAVULANATE', 'CLAVAMOX', 'AUGMENTIN',
        'AMPICILLIN', 'OMNIPEN',

        // Fluoroquinolones
        'ENROFLOXACIN', 'BAYTRIL',
        'MARBOFLOXACIN', 'ZENIQUIN',
        'ORBIFLOXACIN', 'ORBAX',
        'PRADOFLOXACIN', 'VERAFLOX',
        'CIPROFLOXACIN', 'CIPRO',

        // Other antibiotics
        'METRONIDAZOLE', 'FLAGYL',
        'DOXYCYCLINE', 'VIBRAMYCIN', 'VIBRA-TABS',
        'CLINDAMYCIN', 'ANTROBE', 'CLEOCIN',
        'TRIMETHOPRIM SULFA', 'TRIBRISSEN', 'BACTRIM',
        'AZITHROMYCIN', 'ZITHROMAX',

        // GI medications
        'OMEPRAZOLE', 'PRILOSEC', 'GASTROGARD', 'ULCERGARD',
        'FAMOTIDINE', 'PEPCID',
        'RANITIDINE', 'ZANTAC',
        'SUCRALFATE', 'CARAFATE',
        'METOCLOPRAMIDE', 'REGLAN',
        'ONDANSETRON', 'ZOFRAN',
        'MISOPROSTOL', 'CYTOTEC',
        'LACTULOSE', 'KRISTALOSE',
        'LOPERAMIDE',

        // Cardiac
        'FUROSEMIDE', 'LASIX', 'SALIX',
        'ENALAPRIL', 'ENACARD',
        'BENAZEPRIL', 'FORTEKOR', 'LOTENSIN',
        'PIMOBENDAN', 'VETMEDIN',
        'ATENOLOL', 'TENORMIN',
        'AMIODARONE', 'CORDARONE',
        'DIGOXIN', 'LANOXIN',
        'DILTIAZEM', 'CARDIZEM',
        'AMLODIPINE', 'NORVASC',
        'SPIRONOLACTONE', 'ALDACTONE',
        'CLOPIDOGREL',
        'HYDROCHLOROTHIAZIDE', 'HCTZ',

        // Emergency/Anesthesia
        'KETAMINE', 'KETASET', 'VETALAR',
        'PROPOFOL', 'DIPRIVAN', 'PROPOFLO',
        'MIDAZOLAM', 'VERSED',
        'DIAZEPAM', 'VALIUM',
        'ATROPINE',
        'GLYCOPYRROLATE', 'ROBINUL',
        'ACEPROMAZINE', 'PROMACE',
        'BUTORPHANOL', 'TORBUGESIC', 'TORBUTROL',
        'BUPRENORPHINE', 'BUPRENEX',

        // Behavior
        'FLUOXETINE', 'PROZAC', 'RECONCILE',
        'TRAZODONE', 'DESYREL', 'OLEPTRO',
        'SERTRALINE', 'ZOLOFT',
        'PAROXETINE', 'PAXIL',
        'ALPRAZOLAM', 'XANAX',
        'LORAZEPAM', 'ATIVAN',
        'CLONAZEPAM', 'KLONOPIN',
        'AMITRIPTYLINE', 'ELAVIL',
        'CLOMIPRAMINE', 'ANAFRANIL',

        // Anticonvulsants
        'PHENOBARBITAL', 'LUMINAL',
        'LEVETIRACETAM', 'KEPPRA',
        'ZONISAMIDE', 'ZONEGRAN',
        'POTASSIUM BROMIDE', 'K-BROVET',

        // Hormones/Endocrine
        'INSULIN', 'HUMULIN', 'NOVOLIN', 'LANTUS', 'VETSULIN', 'PROZINC',
        'METHIMAZOLE', 'TAPAZOLE', 'FELIMAZOLE',
        'LEVOTHYROXINE', 'SYNTHROID', 'SOLOXINE',
        'TRILOSTANE', 'VETORYL',
        'MITOTANE', 'LYSODREN',
        'SELEGILINE', 'ANIPRYL', 'ELDEPRYL',

        // Respiratory
        'THEOPHYLLINE', 'THEO-DUR',
        'TERBUTALINE', 'BRETHINE',
        'AMINOPHYLLINE',

        // Antihistamines
        'DIPHENHYDRAMINE', 'BENADRYL',
        'CETIRIZINE', 'ZYRTEC',
        'LORATADINE', 'CLARITIN',
        'CHLORPHENIRAMINE', 'CHLOR-TRIMETON',
        'HYDROXYZINE', 'ATARAX', 'VISTARIL',
        'CYPROHEPTADINE', 'PERIACTIN',

        // Supplements/Other
        'URSODIOL', 'ACTIGALL',
        'VITAMIN K1', 'PHYTONADIONE',

        // Topicals
        'MUPIROCIN', 'BACTROBAN',
        'SILVER SULFADIAZINE', 'SILVADENE',
        'TRIAMCINOLONE', 'KENALOG',
        'BETAMETHASONE', 'DIPROLENE',

        // Antiparasitics (crossover)
        'IVERMECTIN', 'HEARTGARD', 'IVOMEC',
        'SELAMECTIN', 'REVOLUTION',
        'FENBENDAZOLE', 'PANACUR', 'SAFEGUARD',
        'PRAZIQUANTEL', 'DRONTAL', 'DRONCIT',
        'PYRANTEL PAMOATE', 'NEMEX', 'STRONGID',
        'SULFADIMETHOXINE', 'ALBON',
        'PONAZURIL', 'MARQUIS',
        'TOLTRAZURIL', 'BAYCOX'
    ],

    // Pharmacological classes (partial matches allowed)
    classes: [
        "PROTON PUMP INHIBITOR", "ACE INHIBITOR", "NSAID",
        "BENZODIAZEPINE", "H2 ANTAGONIST", "OPIOID",
        "BETA-LACTAM", "FLUOROQUINOLONE", "CORTICOSTEROID",
        "DIURETIC", "ANTIHISTAMINE", "SSRI",
        "TRICYCLIC ANTIDEPRESSANT", "ANTICONVULSANT",
        "INSULIN", "THYROID HORMONE", "NITROIMIDAZOLE", "ANTIBIOTIC",
        "BETA-BLOCKER"
    ],

    // Bucket C: Hard block list (only these are hidden)
    blocklist: [
        // Contraceptives
        'ETHINYL ESTRADIOL', 'NORGESTIMATE', 'LEVONORGESTREL',
        'ETONOGESTREL', 'NORELGESTROMIN', 'DESOGESTREL',
        'DROSPIRENONE', 'NORETHINDRONE', 'MEDROXYPROGESTERONE',
        'ULIPRISTAL', 'MIFEPRISTONE',
        // Toxic to animals
        'XYLITOL',
        // Human-only chemotherapy
        'METHOTREXATE', 'TAMOXIFEN', 'ANASTROZOLE',
        // Human-only misc
        'ORLISTAT', 'VARENICLINE', 'NICOTINE PATCH', 'NICOTINE GUM'
    ]
};

/**
 * Brand-to-generic alias map for identity resolution
 */
const BRAND_TO_GENERIC_ALIAS: Record<string, string> = {
    // NSAIDs
    'RIMADYL': 'CARPROFEN', 'NOVOCOX': 'CARPROFEN', 'VETPROFEN': 'CARPROFEN', 'QUELLIN': 'CARPROFEN',
    'METACAM': 'MELOXICAM', 'LOXICOM': 'MELOXICAM',
    'ONSIOR': 'ROBENACOXIB', 'PREVICOX': 'FIROCOXIB', 'DERAMAXX': 'DERACOXIB', 'GALLIPRANT': 'GRAPIPRANT',
    // Antibiotics
    'BAYTRIL': 'ENROFLOXACIN', 'ZENIQUIN': 'MARBOFLOXACIN', 'ORBAX': 'ORBIFLOXACIN', 'VERAFLOX': 'PRADOFLOXACIN',
    'CLAVAMOX': 'AMOXICILLIN CLAVULANATE', 'AUGMENTIN': 'AMOXICILLIN CLAVULANATE',
    'KEFLEX': 'CEPHALEXIN', 'RILEXINE': 'CEPHALEXIN',
    'CONVENIA': 'CEFOVECIN', 'SIMPLICEF': 'CEFPODOXIME', 'MEFOXIN': 'CEFOXITIN',
    'FLAGYL': 'METRONIDAZOLE', 'VIBRAMYCIN': 'DOXYCYCLINE', 'ANTROBE': 'CLINDAMYCIN', 'CLEOCIN': 'CLINDAMYCIN',
    'TRIBRISSEN': 'TRIMETHOPRIM SULFA', 'BACTRIM': 'TRIMETHOPRIM SULFA', 'ZITHROMAX': 'AZITHROMYCIN',
    // GI
    'PRILOSEC': 'OMEPRAZOLE', 'GASTROGARD': 'OMEPRAZOLE', 'ULCERGARD': 'OMEPRAZOLE',
    'PEPCID': 'FAMOTIDINE', 'ZANTAC': 'RANITIDINE', 'CARAFATE': 'SUCRALFATE',
    'REGLAN': 'METOCLOPRAMIDE', 'ZOFRAN': 'ONDANSETRON', 'CYTOTEC': 'MISOPROSTOL', 'KRISTALOSE': 'LACTULOSE',
    // Cardiac
    'LASIX': 'FUROSEMIDE', 'SALIX': 'FUROSEMIDE', 'ENACARD': 'ENALAPRIL',
    'FORTEKOR': 'BENAZEPRIL', 'LOTENSIN': 'BENAZEPRIL', 'VETMEDIN': 'PIMOBENDAN',
    'TENORMIN': 'ATENOLOL', 'CORDARONE': 'AMIODARONE', 'LANOXIN': 'DIGOXIN',
    'CARDIZEM': 'DILTIAZEM', 'NORVASC': 'AMLODIPINE', 'ALDACTONE': 'SPIRONOLACTONE',
    // Anesthesia/Emergency
    'KETASET': 'KETAMINE', 'VETALAR': 'KETAMINE', 'DIPRIVAN': 'PROPOFOL', 'PROPOFLO': 'PROPOFOL',
    'VERSED': 'MIDAZOLAM', 'VALIUM': 'DIAZEPAM', 'ROBINUL': 'GLYCOPYRROLATE',
    'PROMACE': 'ACEPROMAZINE', 'TORBUGESIC': 'BUTORPHANOL', 'TORBUTROL': 'BUTORPHANOL', 'BUPRENEX': 'BUPRENORPHINE',
    // Behavior
    'PROZAC': 'FLUOXETINE', 'RECONCILE': 'FLUOXETINE', 'DESYREL': 'TRAZODONE', 'OLEPTRO': 'TRAZODONE',
    'ZOLOFT': 'SERTRALINE', 'PAXIL': 'PAROXETINE', 'XANAX': 'ALPRAZOLAM',
    'ATIVAN': 'LORAZEPAM', 'KLONOPIN': 'CLONAZEPAM', 'ELAVIL': 'AMITRIPTYLINE', 'ANAFRANIL': 'CLOMIPRAMINE',
    // Anticonvulsants
    'LUMINAL': 'PHENOBARBITAL', 'KEPPRA': 'LEVETIRACETAM', 'ZONEGRAN': 'ZONISAMIDE', 'K-BROVET': 'POTASSIUM BROMIDE',
    // Hormones/Endocrine
    'HUMULIN': 'INSULIN', 'NOVOLIN': 'INSULIN', 'LANTUS': 'INSULIN', 'VETSULIN': 'INSULIN', 'PROZINC': 'INSULIN',
    'TAPAZOLE': 'METHIMAZOLE', 'FELIMAZOLE': 'METHIMAZOLE',
    'SYNTHROID': 'LEVOTHYROXINE', 'SOLOXINE': 'LEVOTHYROXINE',
    'VETORYL': 'TRILOSTANE', 'LYSODREN': 'MITOTANE', 'ANIPRYL': 'SELEGILINE', 'ELDEPRYL': 'SELEGILINE',
    // Antihistamines
    'BENADRYL': 'DIPHENHYDRAMINE', 'ZYRTEC': 'CETIRIZINE', 'CLARITIN': 'LORATADINE',
    'CHLOR-TRIMETON': 'CHLORPHENIRAMINE', 'ATARAX': 'HYDROXYZINE', 'VISTARIL': 'HYDROXYZINE', 'PERIACTIN': 'CYPROHEPTADINE',
    // Supplements
    'ACTIGALL': 'URSODIOL',
    // Topicals
    'BACTROBAN': 'MUPIROCIN', 'SILVADENE': 'SILVER SULFADIAZINE', 'KENALOG': 'TRIAMCINOLONE', 'DIPROLENE': 'BETAMETHASONE',
    // Antiparasitics
    'HEARTGARD': 'IVERMECTIN', 'IVOMEC': 'IVERMECTIN', 'REVOLUTION': 'SELAMECTIN',
    'PANACUR': 'FENBENDAZOLE', 'SAFEGUARD': 'FENBENDAZOLE',
    'DRONTAL': 'PRAZIQUANTEL', 'DRONCIT': 'PRAZIQUANTEL',
    'NEMEX': 'PYRANTEL PAMOATE', 'STRONGID': 'PYRANTEL PAMOATE',
    'ALBON': 'SULFADIMETHOXINE', 'MARQUIS': 'PONAZURIL', 'BAYCOX': 'TOLTRAZURIL',
    // Pain/Neuro
    'NEURONTIN': 'GABAPENTIN', 'LYRICA': 'PREGABALIN', 'ULTRAM': 'TRAMADOL',
    // Other
    'CERENIA': 'MAROPITANT', 'APOQUEL': 'OCLACITINIB', 'ATOPICA': 'CYCLOSPORINE'
};

/**
 * Get all possible identity candidates for a drug as an array (brand, generic, plus aliases)
 */
const getIdentityCandidates = (brandName: string, genericName: string): string[] => {
    const candidates = new Set<string>();

    if (brandName) candidates.add(brandName);
    if (genericName) candidates.add(genericName);

    // Forward: if brand is an alias key, add its generic
    for (const [brandAlias, genericAlias] of Object.entries(BRAND_TO_GENERIC_ALIAS)) {
        if (brandName.includes(brandAlias) || genericName.includes(brandAlias)) {
            candidates.add(genericAlias.toUpperCase());
            candidates.add(brandAlias);
        }
    }
    // Reverse: if generic matches an alias value, add the brand key
    for (const [brandAlias, genericAlias] of Object.entries(BRAND_TO_GENERIC_ALIAS)) {
        if (genericName === genericAlias.toUpperCase() || brandName === genericAlias.toUpperCase()) {
            candidates.add(brandAlias);
        }
    }

    return Array.from(candidates);
};

/**
 * Helper: Check for any veterinary context signal (for REVIEW tier)
 * Used for drugs NOT in the guarantee list or blocklist.
 */
const hasAnyVeterinarySignal = (res: any): boolean => {
    const textToCheck = [
        res.description?.[0],
        res.dosage_and_administration?.[0],
        res.indications_and_usage?.[0],
        res.openfda?.route?.[0],
        res.openfda?.substance_name?.[0]
    ].filter(Boolean).join(" ").toLowerCase();
    const pharmClass = (res.openfda?.pharmacological_class || []).join(" ").toUpperCase();

    // Weight-based dosing
    if (/\d+\s*mg\s*\/\s*(kg|lb)/i.test(textToCheck)) return true;
    // Species mentions
    if (/\b(canine|feline|dog|cat|pet|equine|bovine|ovine|porcine|avian|veterinary|animal|species)\b/.test(textToCheck)) return true;
    // Common veterinary drug classes
    if (VET_CROSSOVER_CONFIG.classes.some(cls => pharmClass.includes(cls))) return true;

    return false;
};

const SCORING_VERSION = "3.0"; // Simplified inclusive bucket-based logic

const TIER_DISCLAIMERS: Record<string, any> = {
    VETERINARY: {
        badge: "✓ FDA-Approved Animal Drug",
        color: "green",
        disclaimer: "Approved for animal use. Follow veterinary label directions.",
        warning: null
    },
    CROSSOVER: {
        badge: "⚡ Common Veterinary Use",
        color: "blue",
        disclaimer: "Human-labeled drug with established veterinary use. Dosing and indications may differ from human medicine.",
        warning: "Extralabel use should follow AMDUCA guidelines."
    },
    REVIEW: {
        badge: "⚠️ Consult Veterinarian",
        color: "yellow",
        disclaimer: "Potential veterinary application identified. Not FDA-approved for this species.",
        warning: "Requires veterinary evaluation before use. Safety and efficacy not established."
    },
    HUMAN: {
        badge: "Human Use Only",
        color: "gray",
        disclaimer: "Not indicated for veterinary use.",
        warning: "May be contraindicated in animals. Consult veterinarian before any use."
    }
};

interface VeterinaryScore {
    score: number;
    tier: 'VETERINARY' | 'CROSSOVER' | 'REVIEW' | 'HUMAN';
    reasons: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    signalCount: number;
    version: string;
    tierInfo: any;
    priority: number;
    show: boolean;
}

/**
 * Core Scoring Function for Veterinary Relevance (Inclusive Bucket-Based)
 */
const calculateVeterinaryScore = (res: any): VeterinaryScore => {
    const brandName = (res.openfda?.brand_name?.[0] || "").toUpperCase();
    const genericName = (res.openfda?.generic_name?.[0] || "").toUpperCase();
    const productType = (res.openfda?.product_type?.[0] || "").toUpperCase();
    const reasons: string[] = [];

    // Build array of all identity candidates (brand, generic, aliases)
    const identityCandidates = getIdentityCandidates(brandName, genericName);

    // ─── BUCKET C: Hard block list (only these are hidden) ───
    const isHardBlocked = VET_CROSSOVER_CONFIG.blocklist.some(item =>
        identityCandidates.some(c => c.includes(item) || item.includes(c))
    );
    if (isHardBlocked) {
        reasons.push("Human-only / Contraindicated for animals.");
        return {
            score: 0, tier: 'HUMAN', reasons, confidence: 'HIGH',
            signalCount: 0, version: SCORING_VERSION,
            tierInfo: TIER_DISCLAIMERS['HUMAN'], priority: 5, show: false
        };
    }

    // ─── BUCKET A: FDA Animal Drug label ───
    const isAnimalLabeled = productType.includes("ANIMAL");
    if (isAnimalLabeled) {
        reasons.push("FDA-approved animal drug product.");
        return {
            score: 100, tier: 'VETERINARY', reasons, confidence: 'HIGH',
            signalCount: 1, version: SCORING_VERSION,
            tierInfo: TIER_DISCLAIMERS['VETERINARY'], priority: 1, show: true
        };
    }

    // ─── BUCKET B: Guarantee list (THE FIX — if it's in the list, it shows. Period.) ───
    const isGuaranteedMatch = VET_CROSSOVER_CONFIG.drugs.some(drug =>
        identityCandidates.some(c => c === drug || c.includes(drug) || drug.includes(c))
    );
    if (isGuaranteedMatch) {
        reasons.push("Listed in veterinary guarantee reference. Common in veterinary practice.");
        return {
            score: 75, tier: 'CROSSOVER', reasons, confidence: 'HIGH',
            signalCount: 1, version: SCORING_VERSION,
            tierInfo: TIER_DISCLAIMERS['CROSSOVER'], priority: 2, show: true
        };
    }

    // ─── REVIEW: Has any veterinary signal ───
    if (hasAnyVeterinarySignal(res)) {
        reasons.push("Veterinary context detected (species keywords, mg/kg dosing, or relevant drug class).");
        return {
            score: 50, tier: 'REVIEW', reasons, confidence: 'MEDIUM',
            signalCount: 1, version: SCORING_VERSION,
            tierInfo: TIER_DISCLAIMERS['REVIEW'], priority: 3, show: true
        };
    }

    // ─── UNKNOWN / HUMAN: No veterinary signals, hidden by default ───
    reasons.push("No veterinary signals detected.");
    return {
        score: 0, tier: 'HUMAN', reasons, confidence: 'LOW',
        signalCount: 0, version: SCORING_VERSION,
        tierInfo: TIER_DISCLAIMERS['HUMAN'], priority: 4, show: false
    };
};

// Lightweight export used by verification scripts and unit-style checks.
export const scoreVeterinaryCandidate = (labelLikeObject: any): VeterinaryScore => {
    return calculateVeterinaryScore(labelLikeObject);
};

/**
 * Caching Layer for Veterinary Scores
 */
const getDrugScore = async (res: any): Promise<VeterinaryScore> => {
    const brandName = (res.openfda?.brand_name?.[0] || "").toUpperCase();
    const genericName = (res.openfda?.generic_name?.[0] || "").toUpperCase();

    if (!brandName) return calculateVeterinaryScore(res);

    try {
        const cached = await (prisma as any).drugScoreCache.findUnique({
            where: {
                brandName_genericName: { brandName, genericName }
            }
        });

        // Version-aware caching: Invalidate if logic version changed
        if (cached && cached.expiresAt > new Date() && cached.version === SCORING_VERSION) {
            return {
                score: cached.score,
                tier: cached.tier as any,
                reasons: cached.reasons,
                confidence: cached.confidence as any,
                signalCount: cached.signalCount || 0,
                version: cached.version,
                tierInfo: cached.tierInfo,
                priority: cached.priority ?? 4,
                show: cached.show ?? (cached.tier !== 'HUMAN')
            };
        }

        const freshScore = calculateVeterinaryScore(res);

        // Background update/insert (don't await to keep search fast)
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30); // 30 day cache

        (prisma as any).drugScoreCache.upsert({
            where: { brandName_genericName: { brandName, genericName } },
            update: {
                score: freshScore.score,
                tier: freshScore.tier,
                reasons: freshScore.reasons,
                confidence: freshScore.confidence,
                signalCount: freshScore.signalCount,
                version: freshScore.version,
                tierInfo: freshScore.tierInfo as any,
                expiresAt: expiry,
                lastUpdated: new Date()
            },
            create: {
                brandName,
                genericName,
                score: freshScore.score,
                tier: freshScore.tier,
                reasons: freshScore.reasons,
                confidence: freshScore.confidence,
                signalCount: freshScore.signalCount,
                version: freshScore.version,
                tierInfo: freshScore.tierInfo as any,
                expiresAt: expiry
            }
        }).catch((e: any) => console.error("Cache upsert failed:", e));

        return freshScore;
    } catch (e) {
        console.error("Database cache error:", e);
        return calculateVeterinaryScore(res);
    }
};

const fetchSearchResults = async (searchClause: string, limit = 50): Promise<any[]> => {
    const url = `${OPENFDA_API_URL}?search=${searchClause}&limit=${limit}`;
    const data = await fetchWithRetry(url);
    if (data?.error || !Array.isArray(data?.results)) return [];
    return data.results;
};

export const searchDrugs = async (query: string) => {
    try {
        const sanitized = query.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        if (!sanitized) {
            return { medicines: [], availableForms: [], formCounts: {}, totalCount: 0, found: false };
        }

        // Step 1 (strict): animal products only
        const animalSearch = `openfda.product_type:"ANIMAL DRUG"+AND+(openfda.brand_name:${sanitized}*+OR+openfda.generic_name:${sanitized}*)`;
        // Step 2 (fallback): broad labels, then vet relevance filter
        const broadSearch = `(openfda.brand_name:${sanitized}*+OR+openfda.generic_name:${sanitized}*)`;

        const animalResults = await fetchSearchResults(animalSearch, 50);
        const sourceResultsRaw = animalResults.length > 0
            ? animalResults
            : (await fetchSearchResults(broadSearch, 50));

        // Step 2: Score and filter by Veterinary Preference
        const scoredResults = await Promise.all(
            sourceResultsRaw.map(async (res: any) => ({
                ...res,
                _vetScore: await getDrugScore(res)
            }))
        );

        // 3. Filter out non-veterinary results (Tier: HUMAN) by default
        const filteredResults = scoredResults.filter(res => res._vetScore.tier !== 'HUMAN');

        // 4. Sort results: Priority by Tier, then by Score within tier
        const tierOrder: Record<string, number> = { 'VETERINARY': 0, 'CROSSOVER': 1, 'REVIEW': 2, 'HUMAN': 3 };
        filteredResults.sort((a, b) => {
            if (tierOrder[a._vetScore.tier] !== tierOrder[b._vetScore.tier]) {
                return tierOrder[a._vetScore.tier] - tierOrder[b._vetScore.tier];
            }
            return b._vetScore.score - a._vetScore.score;
        });

        // 5. Build category groups for specialized storage/display
        const categories = {
            veterinary: filteredResults.filter(r => r._vetScore.tier === 'VETERINARY'),
            crossover: filteredResults.filter(r => r._vetScore.tier === 'CROSSOVER'),
            review: filteredResults.filter(r => r._vetScore.tier === 'REVIEW')
        };

        const availableFormsSet = new Set<string>();
        const formCounts: Record<string, number> = {};
        // Priority-based deduplication: keep highest-priority entry per application number
        const dedupGroups = new Map<string, any>();

        const rawMedicines = filteredResults
            .map((res: any) => {
                // ALWAYS extract forms first — even if the result is missing identifiers
                const discoveredForms = extractFormsWithFallback(res);
                discoveredForms.forEach((form: string) => {
                    availableFormsSet.add(form);
                    formCounts[form] = (formCounts[form] || 0) + 1;
                });

                // Use fallbacks so no medicine is ever silently dropped
                const appNum = res.openfda?.application_number?.[0] || `GEN-${res.openfda?.generic_name?.[0] || sanitized}`;
                const brandName = res.openfda?.brand_name?.[0] || res.openfda?.generic_name?.[0] || sanitized;

                // Priority-based dedup: lower priority number = higher priority (VETERINARY=1 beats CROSSOVER=2)
                const existing = dedupGroups.get(appNum);
                if (existing) {
                    if (res._vetScore.priority < existing._vetScore.priority) {
                        dedupGroups.set(appNum, res); // Replace with higher-priority entry
                    }
                    return null;
                }
                dedupGroups.set(appNum, res);

                const variants = parseStrengthVariants(res.dosage_forms_and_strengths || []);
                let primaryVariant = variants.find(v => v.strength !== null) || variants[0];

                // If no variants with strength found, try to extract from brand name or description
                let strength = primaryVariant?.strength ?? null;
                let unit = primaryVariant?.unit ?? null;

                if (strength === null) {
                    const fallback = extractStrengthFromText(`${brandName} ${res.description?.[0] || ""}`);
                    strength = fallback.strength;
                    unit = fallback.unit;
                }

                const hasClinicalRef = false;

                return {
                    applicationNumber: appNum,
                    brandName,
                    genericName: res.openfda?.generic_name?.[0],
                    manufacturer: res.openfda?.manufacturer_name?.[0],
                    route: res.openfda?.route?.[0],
                    normalizedForms: discoveredForms,
                    description: res.description?.[0] || "",
                    strength,
                    unit,
                    variants: variants.length > 0 ? variants : [{ strength, unit, form: discoveredForms[0] || null }],
                    hasClinicalReference: hasClinicalRef,
                    // Store raw text for fast dose extraction - no extra API call needed
                    _brandName: brandName,
                    _discoveredForms: discoveredForms,
                    _fdaRoute: res.openfda?.route?.[0],
                    _rawDosageText: res.dosage_and_administration?.[0] || "",
                    _rawIndicationsText: res.indications_and_usage?.[0] || "",
                    vetScore: res._vetScore // Pass through score for UI display
                };
            }).filter(Boolean);

        const medicines: any[] = rawMedicines.map((med: any) => {
            const { _brandName, _discoveredForms, _fdaRoute, ...rest } = med;
            // Extract dosing rules directly from the FDA label text fetched in this same request (fast, no extra API calls)
            const textToAnalyze = [
                med._rawDosageText,
                med._rawIndicationsText
            ].filter(Boolean).join(" ");
            const rules = extractWeightBasedRule(textToAnalyze || "", _discoveredForms, _fdaRoute);
            return {
                ...rest,
                suggestedClinicalRules: (rules && rules.minDoseMgPerKg > 0) ? [rules] : null
            };
        });

        return {
            medicines,
            availableForms: Array.from(availableFormsSet).sort(),
            formCounts,
            totalCount: medicines.length,
            found: medicines.length > 0,
            // Split results for front-end categorization if needed
            categories: {
                veterinary: medicines.filter(m => m.vetScore.tier === 'VETERINARY'),
                crossover: medicines.filter(m => m.vetScore.tier === 'CROSSOVER'),
                review: medicines.filter(m => m.vetScore.tier === 'REVIEW')
            }
        };
    } catch (error) {
        console.error("OpenFDA Search Error:", error);
        return { medicines: [], availableForms: [], formCounts: {}, totalCount: 0, found: false };
    }
};

/**
 * Fetch Drug Details (Metadata Only)
 */
const fetchDrugDetails = async (applicationNumber: string): Promise<OpenFdaDrugDetails | null> => {
    try {
        const url = `${OPENFDA_API_URL}?search=openfda.application_number:"${applicationNumber}"&limit=1`;
        const data = await fetchWithRetry(url);

        if (data.error || !data.results?.[0]) return null;
        const res = data.results[0];

        const name = res.openfda?.brand_name?.[0] ?? null;
        const genericName = res.openfda?.generic_name?.[0] ?? null;
        const description = res.description?.[0] ?? null;
        const route = res.openfda?.route?.[0] ?? null;
        const variants = parseStrengthVariants(res.dosage_forms_and_strengths || []);

        const safetyWarnings: SafetyWarning[] = [];
        if (res.warnings?.[0]) safetyWarnings.push({ type: 'warning', text: res.warnings[0].slice(0, 300) });
        if (res.contraindications?.[0]) safetyWarnings.push({ type: 'contraindication', text: res.contraindications[0].slice(0, 300) });

        // No more hardcoded KB lookup
        const hasClinicalReference = false;

        return {
            name,
            genericName,
            description,
            variants,
            route,
            safetyWarnings,
            hasClinicalReference
        };
    } catch (error) {
        console.error("OpenFDA Details Error:", error);
        return null;
    }
};

/**
 * Get dosing rules for a single drug using the dual-API pipeline.
 * Called once when user selects a medicine (not during search).
 */
export const getDoseForDrug = async (brandName: string, genericName: string, forms: string[], fdaRoute?: string) => {
    return fetchDualApiDose(brandName, forms, fdaRoute, genericName);
};

export const openFdaService = {
    searchDrugs,
    fetchDrugDetails,
    getDoseForDrug
};
