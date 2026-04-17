// @ts-nocheck
// master-medicine/masterMedicine.service.ts
// The Invisible Brain — search, merge, learn, ranking logic
import prisma from "../../../utils/prisma.js";
import { SALT_SUFFIXES } from "../external-api/veterinary.constants.js";
import { masterMedicineNormalizer } from "./masterMedicine.normalizer.js";

// ─── Generic Name Normalization ─────────────────────────────────
/**
 * Strip salt suffixes to normalize generic names
 * "amoxicillin trihydrate" → "amoxicillin"
 * "dexmedetomidine hydrochloride" → "dexmedetomidine"
 */
const normalizeGenericName = (name: string): string => {
    return masterMedicineNormalizer.normalizeGenericName(name).toLowerCase();
};

// ─── Brain Search (3-Layer Pipeline) ────────────────────────────

/**
 * Layer A: Prefix search (fastest, ~10ms)
 */
const prefixSearch = async (query: string, limit: number = 20) => {
    const q = query.toLowerCase().trim();
    return prisma.masterMedicine.findMany({
        where: {
            OR: [
                { genericNameLower: { startsWith: q, mode: "insensitive" } },
                { name: { startsWith: q, mode: "insensitive" } },
                { activeIngredient: { startsWith: q, mode: "insensitive" } },
                { synonyms: { has: q } },
            ],
        },
        orderBy: { searchHitCount: "desc" },
        take: limit,
    });
};

/**
 * Layer B: Text search via contains (fast, ~30ms)
 */
const textSearch = async (query: string, limit: number = 20) => {
    const q = query.toLowerCase().trim();
    return prisma.masterMedicine.findMany({
        where: {
            OR: [
                { genericNameLower: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
                { activeIngredient: { contains: q, mode: "insensitive" } },
            ],
        },
        orderBy: { searchHitCount: "desc" },
        take: limit,
    });
};

/**
 * Layer C: Fuzzy match using Levenshtein distance (typo tolerance)
 * Only triggered when Layers A+B return < 3 results
 */
const levenshteinDistance = (a: string, b: string): number => {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i]![0] = i;
    for (let j = 0; j <= n; j++) dp[0]![j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i]![j] = Math.min(
                dp[i - 1]![j]! + 1,
                dp[i]![j - 1]! + 1,
                dp[i - 1]![j - 1]! + (a[i - 1] !== b[j - 1] ? 1 : 0)
            );
        }
    }
    return dp[m]![n]!;
};

const fuzzySearch = async (query: string, limit: number = 20) => {
    const q = query.toLowerCase().trim();
    // Get all unique genericNameLower values in batches for fuzzy matching
    const allMeds = await prisma.masterMedicine.findMany({
        select: { id: true, genericNameLower: true, name: true, searchHitCount: true },
    });

    const matches: { id: string; distance: number; hitCount: number }[] = [];
    const seen = new Set<string>();

    for (const med of allMeds) {
        if (!med.genericNameLower || seen.has(med.genericNameLower)) continue;
        seen.add(med.genericNameLower);

        const distance = levenshteinDistance(q, med.genericNameLower);
        
        // Calculate similarity percentage (0 to 1)
        const maxLength = Math.max(q.length, med.genericNameLower.length);
        const similarity = maxLength === 0 ? 0 : (maxLength - distance) / maxLength;

        // Strict Confidence Threshold: 
        // 1. Minimum 70% similarity OR 
        // 2. Exact substring match (if one is a subset of the other, handled by textSearch usually, but good fallback)
        if (similarity >= 0.7) {
            matches.push({ id: med.id, distance, hitCount: med.searchHitCount });
        }
    }

    // Sort by distance first, then popularity
    matches.sort((a, b) => a.distance - b.distance || b.hitCount - a.hitCount);
    const topIds = matches.slice(0, limit).map((m) => m.id);

    if (topIds.length === 0) return [];

    return prisma.masterMedicine.findMany({
        where: { id: { in: topIds } },
    });
};

// ─── Ranking Algorithm ──────────────────────────────────────────

interface ScoredResult {
    record: any;
    score: number;
    matchType: "exact" | "prefix" | "synonym" | "text" | "fuzzy";
}

const scoreResult = (record: any, query: string, matchType: ScoredResult["matchType"]): number => {
    let score = 0;
    const q = query.toLowerCase().trim();

    // Match type base score
    switch (matchType) {
        case "exact": score += 100; break;
        case "prefix": score += 70; break;
        case "synonym": score += 60; break;
        case "text": score += 50; break;
        case "fuzzy": score += 30; break;
    }

    // Exact match bonus
    if (record.genericNameLower === q || record.name?.toLowerCase() === q) {
        score += 100;
    }

    // Veterinary-specific bonus
    if (record.isVeterinarySpecific) score += 30;

    // Clinical data richness
    const dosingRules = record.dosingRules as any[];
    if (Array.isArray(dosingRules) && dosingRules.length > 0) score += 20;
    const breedSensitivities = record.breedSensitivities as any[];
    if (Array.isArray(breedSensitivities) && breedSensitivities.length > 0) score += 15;

    // Popularity boost (capped at 50)
    score += Math.min(record.searchHitCount || 0, 50);

    return score;
};

// ─── Completeness Check ─────────────────────────────────────────

const isRecordComplete = (record: any): boolean => {
    const hasName = !!(record.name || record.genericName);
    const hasForm = !!(record.form && record.form !== "Unknown" && record.form !== "");
    const hasStrength = record.strengthValue !== null && record.strengthValue !== undefined;
    const hasRoute = Array.isArray(record.route) ? record.route.length > 0 : !!record.route;
    const dosingRules = record.dosingRules as any[];
    const hasDosing = Array.isArray(dosingRules) && dosingRules.length > 0;

    return hasName && hasForm && hasStrength && hasRoute && hasDosing;
};

// ─── Format Brain Result as FDA-Compatible Response ─────────────

const formatAsFdaResponse = (records: any[]) => {
    const availableFormsSet = new Set<string>();
    const formCounts: Record<string, number> = {};

    const medicines = records.flatMap((record) => {
        // Build variants array (matching FDA shape)
        const variants: any[] = [];
        if (record.strengthValue !== null && record.strengthValue !== undefined) {
            variants.push({
                strength: record.strengthValue,
                unit: record.strengthUnit || "mg",
                form: record.form || null,
            });
        }

        // Build forms array if available
        const formsData = record.forms as any[];
        if (Array.isArray(formsData)) {
            for (const formEntry of formsData) {
                if (!formEntry || typeof formEntry !== "object") continue;
                const strengths = Array.isArray(formEntry.strengths) ? formEntry.strengths : [];
                for (const str of strengths) {
                    if (!str || typeof str !== "object") continue;
                    const sv = parseFloat(str.strengthValue);
                    if (!isNaN(sv)) {
                        variants.push({
                            strength: sv,
                            unit: str.strengthUnit || "mg",
                            form: formEntry.form || null,
                        });
                    }
                }
            }
        }

        // Ensure at least one variant
        if (variants.length === 0) {
            variants.push({ strength: null, unit: null, form: record.form || null });
        }

        // Deduplicate variants
        const uniqueVariantsMap = new Map();
        for (const v of variants) {
            const key = `${v.strength}_${v.unit}_${v.form}`;
            if (!uniqueVariantsMap.has(key)) {
                uniqueVariantsMap.set(key, v);
            }
        }
        const uniqueVariants = Array.from(uniqueVariantsMap.values());

        // Normalize routes
        const routes = Array.isArray(record.route) ? record.route : record.route ? [record.route] : [];

        // Build clinical rules (matching FDA suggestedClinicalRules shape)
        const dosingRules = record.dosingRules as any[];
        let suggestedClinicalRules: any[] | null = null;
        if (Array.isArray(dosingRules) && dosingRules.length > 0) {
            suggestedClinicalRules = dosingRules.map((rule: any) => ({
                species: rule.species || "All Species",
                minDoseMgPerKg: rule.minDoseMgPerKg || 0,
                maxDoseMgPerKg: rule.maxDoseMgPerKg || 0,
                doseUnit: rule.doseUnit || "mg/kg",
                frequency: rule.frequency || "PRN",
                route: rule.route || routes[0] || "",
                instructions: rule.instructions || record.generalUsageInstructions || "",
                doseSource: "BRAIN",
                doseWarning: null,
            }));
        }

        return uniqueVariants.map((v, idx) => {
            // Track forms globally
            const f = v.form || record.form || "Unknown";
            availableFormsSet.add(f);
            formCounts[f] = (formCounts[f] || 0) + 1;

            const normalizedForms = [f, ...routes.map((r: string) => r)].filter(Boolean);

            const baseName = record.name || record.genericName || "Unknown";
            const strengthStrWithSpace = (v.strength !== null && v.strength !== undefined) ? `${v.strength} ${v.unit || ''}`.trim() : "";
            
            // 1. Identify common tokens to remove from the brand name
            const strengthVal = String(v.strength || "");
            const unitVal = String(v.unit || "").toLowerCase();
            const formVal = String(f || "").toLowerCase();

            // 2. Extract brand part before any pipe
            let cleanBase = baseName.split('|')[0].trim();

            // 3. Robust Cleanup: Remove strength/unit/form tokens that might be trailing in the brand name
            const tokensToRemove = [
                strengthVal + unitVal,
                strengthVal + " " + unitVal,
                strengthVal,
                unitVal,
                formVal,
                "mg", "ml", "mcg", "tablet", "tablets", "capsule", "capsules", "cap", "tab"
            ].filter(t => t && t.length > 0).map(t => t.toLowerCase());

            // Sort by length descending to remove longer sequences first
            tokensToRemove.sort((a, b) => b.length - a.length);

            // Re-clean by splitting into words and checking the end
            let words = cleanBase.split(/\s+/);
            while (words.length > 1) {
                const lastRawWord = words[words.length - 1].toLowerCase();
                const lastWordClean = lastRawWord.replace(/[^a-z0-9]/g, '');
                
                const isToken = tokensToRemove.some(t => {
                    const tClean = t.replace(/[^a-z0-9]/g, '');
                    return tClean === lastWordClean && tClean.length > 0;
                });

                if (isToken) {
                    words.pop();
                } else {
                    break;
                }
            }
            cleanBase = words.join(' ').trim();

            // 4. Reconstruct in the standard format: Brand | Strength Form
            let displayBrandName = cleanBase;
            if (strengthStrWithSpace) {
                displayBrandName += ` | ${strengthStrWithSpace}`;
            }
            if (f && !displayBrandName.toLowerCase().includes(f.toLowerCase())) {
                displayBrandName = `${displayBrandName} ${f}`.trim();
            }
            
            // Final Cleanup: Replace multiple spaces and ensure consistent pipe spacing
            displayBrandName = displayBrandName.replace(/\s+/g, ' ').replace(/\s\|\s/g, ' | ').trim();

            return {
                applicationNumber: record.applNo ? `${record.applNo}-VAR${idx}` : `BRAIN-${record.id}-VAR${idx}`,
                brandName: displayBrandName,
                genericName: record.genericName || record.activeIngredient || null,
                manufacturer: record.sponsorName || null,
                form: f,
                route: routes[0] || null,
                normalizedForms: Array.from(new Set(normalizedForms)),
                description: record.generalUsageInstructions || record.indications || "",
                strength: v.strength, // Exact specific strength for this variant
                unit: v.unit,
                variants: [v], // Pass exactly one variant to the UI
                hasClinicalReference: suggestedClinicalRules !== null,
                suggestedClinicalRules,
                _vetScore: {
                    score: record.isVeterinarySpecific ? 90 : 70,
                    tier: record.isVeterinarySpecific ? "VETERINARY" : "CROSSOVER",
                    reasons: ["Matched from Invisible Brain"],
                    confidence: "HIGH",
                },
                // Brain-specific metadata (invisible to UI but useful for merge)
                _brainId: record.id,
                _brainSource: true,
                _brainComplete: isRecordComplete(record),
                // Clinical extras from Brain (not in FDA but useful)
                contraindications: record.contraindications || null,
                adverseReactions: record.adverseReactions || null,
                breedSensitivities: record.breedSensitivities || null,
                interactionWarnings: record.interactionWarnings || null,
            };
        });
    });

    return {
        medicines,
        availableForms: Array.from(availableFormsSet).sort(),
        formCounts,
        totalCount: medicines.length,
        found: medicines.length > 0,
        categories: {
            veterinary: medicines.filter((m) => m._vetScore.tier === "VETERINARY"),
            crossover: medicines.filter((m) => m._vetScore.tier === "CROSSOVER"),
            review: [],
        },
    };
};

// ─── Main Search Function ───────────────────────────────────────

const search = async (query: string) => {
    if (!query || query.length < 2) {
        return { medicines: [], availableForms: [], formCounts: {}, totalCount: 0, found: false, isComplete: false };
    }

    const q = query.toLowerCase().trim();
    const normalizedQ = normalizeGenericName(query);

    // Layer A: Prefix search
    let results = await prefixSearch(normalizedQ.length > 0 ? normalizedQ : q);

    // Layer B: Text search (if prefix returned < 3 results)
    if (results.length < 3) {
        const textResults = await textSearch(q);
        const existingIds = new Set(results.map((r) => r.id));
        for (const r of textResults) {
            if (!existingIds.has(r.id)) {
                results.push(r);
                existingIds.add(r.id);
            }
        }
    }

    // Layer C: Fuzzy search (if still < 3 results)
    if (results.length < 3) {
        const fuzzyResults = await fuzzySearch(q);
        const existingIds = new Set(results.map((r) => r.id));
        for (const r of fuzzyResults) {
            if (!existingIds.has(r.id)) {
                results.push(r);
                existingIds.add(r.id);
            }
        }
    }

    if (results.length === 0) {
        return { medicines: [], availableForms: [], formCounts: {}, totalCount: 0, found: false, isComplete: false };
    }

    // Score and rank results
    const scored: ScoredResult[] = results.map((record) => {
        let matchType: ScoredResult["matchType"] = "text";
        const gn = record.genericNameLower || "";
        const nm = (record.name || "").toLowerCase();

        if (gn === q || nm === q) matchType = "exact";
        else if (gn.startsWith(q) || nm.startsWith(q)) matchType = "prefix";
        else if (record.synonyms?.some((s: string) => s.toLowerCase().includes(q))) matchType = "synonym";

        return {
            record,
            score: scoreResult(record, query, matchType),
            matchType,
        };
    });

    scored.sort((a, b) => b.score - a.score);
    const topRecords = scored.slice(0, 20).map((s) => s.record);

    // Update search hit count (fire-and-forget)
    const ids = topRecords.map((r) => r.id);
    prisma.masterMedicine
        .updateMany({
            where: { id: { in: ids } },
            data: { searchHitCount: { increment: 1 }, lastSearchedAt: new Date() },
        })
        .catch(() => {}); // silent

    // Check if ALL top results are complete
    const allComplete = topRecords.every(isRecordComplete);

    const formatted = formatAsFdaResponse(topRecords);
    return {
        ...formatted,
        isComplete: allComplete,
    };
};

// ─── Score-Based Clinical Merge ───────────────────────────────────

const calculateVariantScore = (brainMed: any, fdaMed: any): number => {
    let score = 0;

    // 1. GenericMatch (50 pts)
    const brainGeneric = normalizeGenericName(brainMed.genericName || brainMed.name || "");
    const fdaGeneric = normalizeGenericName(fdaMed.genericName || fdaMed.brandName || "");
    if (brainGeneric === fdaGeneric && brainGeneric !== "") {
        score += 50;
    }

    // 2. FormMatch (25 pts)
    const brainForm = (brainMed.form || "").toLowerCase();
    const fdaForm = (fdaMed.normalizedForms?.[0] || fdaMed.form || "").toLowerCase();
    if (brainForm && fdaForm && (brainForm.includes(fdaForm) || fdaForm.includes(brainForm))) {
        score += 25;
    }

    // 3. RouteMatch (15 pts)
    const brainRoute = Array.isArray(brainMed.route) ? brainMed.route[0] : brainMed.route;
    const fdaRoute = fdaMed.route;
    if (brainRoute && fdaRoute && String(brainRoute).toLowerCase() === String(fdaRoute).toLowerCase()) {
        score += 15;
    }

    // 4. StrengthMatch (10 pts)
    const brainStrength = String(brainMed.strengthValue || brainMed.strength || "");
    const fdaStrength = String(fdaMed.strength || fdaMed.variants?.[0]?.strength || "");
    if (brainStrength && fdaStrength && brainStrength === fdaStrength) {
        score += 10;
    }

    return score;
};

const mergeWithFda = (brainResult: any, fdaResult: any) => {
    if (!brainResult.found || brainResult.medicines.length === 0) {
        return fdaResult;
    }

    if (!fdaResult.found || fdaResult.medicines.length === 0) {
        return brainResult;
    }

    const mergedMedicines: any[] = [];
    const usedFdaIds = new Set<string>();

    // 1. Process Brain medicines (Base Identity)
    for (const brainMed of brainResult.medicines) {
        // Find the best FDA match for this specific Brain variant
        let bestFdaMatch = null;
        let highestScore = 0;

        for (const fdaMed of fdaResult.medicines) {
            if (usedFdaIds.has(fdaMed.applicationNumber)) continue;
            
            const score = calculateVariantScore(brainMed, fdaMed);
            if (score > highestScore) {
                highestScore = score;
                bestFdaMatch = fdaMed;
            }
        }

        if (bestFdaMatch && highestScore >= 90) {
            // FULL MERGE: Brain + FDA identity are identical
            usedFdaIds.add(bestFdaMatch.applicationNumber);
            mergedMedicines.push({
                ...bestFdaMatch,
                // Brain strictly owns clinical fields
                suggestedClinicalRules: brainMed.suggestedClinicalRules || bestFdaMatch.suggestedClinicalRules,
                hasClinicalReference: brainMed.hasClinicalReference || bestFdaMatch.hasClinicalReference,
                contraindications: brainMed.contraindications || null,
                adverseReactions: brainMed.adverseReactions || null,
                breedSensitivities: brainMed.breedSensitivities || null,
                interactionWarnings: brainMed.interactionWarnings || null,
                // FDA owns structural metadata
                manufacturer: bestFdaMatch.manufacturer || brainMed.manufacturer,
                normalizedForms: bestFdaMatch.normalizedForms?.length > 0 ? bestFdaMatch.normalizedForms : brainMed.normalizedForms,
                _brainSource: true,
                _brainId: brainMed._brainId,
            });
        } else if (bestFdaMatch && highestScore >= 60) {
            // LIMITED MERGE: Same Generic, different variant (e.g., Tube vs Cream)
            // Keep them SEPARATE. Do not leak Brain's dosing rules into this FDA variant.
            mergedMedicines.push(brainMed);
            // We do NOT add the fdaMatch here, it will be added in step 2 (as an unmatched FDA record)
            // This ensures "Ivermectin Solution" (Brain) and "Ivermectin Cream" (FDA) coexist safely.
        } else {
            // NO MERGE
            mergedMedicines.push(brainMed);
        }
    }

    // 2. Add remaining FDA medicines (Unmatched variants)
    for (const fdaMed of fdaResult.medicines) {
        if (!usedFdaIds.has(fdaMed.applicationNumber)) {
            mergedMedicines.push(fdaMed);
        }
    }

    // Rebuild forms/counts
    const availableFormsSet = new Set<string>();
    const formCounts: Record<string, number> = {};
    for (const med of mergedMedicines) {
        const forms = med.normalizedForms || [];
        for (const f of forms) {
            availableFormsSet.add(f);
            formCounts[f] = (formCounts[f] || 0) + 1;
        }
    }

    return {
        medicines: mergedMedicines,
        availableForms: Array.from(availableFormsSet).sort(),
        formCounts,
        totalCount: mergedMedicines.length,
        found: mergedMedicines.length > 0,
        categories: {
            veterinary: mergedMedicines.filter((m: any) => m._vetScore?.tier === "VETERINARY"),
            crossover: mergedMedicines.filter((m: any) => m._vetScore?.tier === "CROSSOVER"),
            review: mergedMedicines.filter((m: any) => m._vetScore?.tier === "REVIEW"),
        },
    };
};

// ─── Self-Learning Mechanisms ───────────────────────────────────

/**
 * Case 1 & 3: Learn from a newly created inventory product
 * Called after product.service.createProduct succeeds (fire-and-forget)
 * NEW RESTRICTION: Only create if doesn't exist. Never automatically update existing verified medical truth.
 */
const learnFromInventory = async (product: any) => {
    try {
        const genericName = product.genericName || product.name;
        if (!genericName) return;

        const normalizedName = normalizeGenericName(genericName);
        if (!normalizedName) return;

        const form = masterMedicineNormalizer.normalizeForm(product.dispensableUnit || product.category);
        const strength = masterMedicineNormalizer.normalizeStrength(product.strength);

        // 1. Check if Brain already has this EXACT canonical variant
        const existing = await prisma.masterMedicine.findFirst({
            where: {
                genericNameLower: normalizedName,
                form: form,
            },
        });

        if (existing) {
            // Variant exists natively. Bump search ranking telemetry 
            await prisma.masterMedicine.update({
                where: { id: Number(existing.id) },
                data: { searchHitCount: { increment: 1 } },
            });
        } else {
            // 2. Variant missing. Create observations for Learning Engine
            const observationData = [];
            
            if (form && form !== "UNKNOWN") {
                observationData.push({
                    genericName: normalizedName,
                    fieldName: "form",
                    fieldValue: form,
                    source: "clinic_inventory",
                    sourceId: product.id || null,
                    confidence: 0.2 // Initial inventory confidence
                });
            }

            if (strength && strength !== "UNKNOWN") {
                observationData.push({
                    genericName: normalizedName,
                    fieldName: "strength",
                    fieldValue: strength,
                    source: "clinic_inventory",
                    sourceId: product.id || null,
                    confidence: 0.2
                });
            }

            if (observationData.length > 0) {
                await prisma.medicineObservation.createMany({
                    data: observationData
                });
                console.log(`[Brain Learning] Logged ${observationData.length} observations for: ${normalizedName}`);
            }
        }
    } catch (error) {
        console.error("[Brain] learnFromInventory error:", error);
    }
};

/**
 * Case 2: Learn from OpenFDA results that Brain didn't have
 * Called after FDA search returns results (fire-and-forget)
 */
const learnFromFda = async (fdaResult: any) => {
    try {
        if (!fdaResult?.medicines || fdaResult.medicines.length === 0) return;

        for (const med of fdaResult.medicines) {
            const genericName = med.genericName || med.brandName;
            if (!genericName) continue;

            const normalizedName = normalizeGenericName(genericName);
            if (!normalizedName) continue;

            // Log an FDA observation for the medicine
            const form = masterMedicineNormalizer.normalizeForm(med.normalizedForms?.[0]);
            
            // Look up whether the generic exists to link ID
            const existingGeneric = await prisma.masterMedicine.findFirst({
                where: { genericNameLower: normalizedName }
            });

            const observationData = [];
            
            if (form && form !== "UNKNOWN") {
                observationData.push({
                    medicineId: existingGeneric ? existingGeneric.id : null,
                    genericName: normalizedName,
                    fieldName: "form",
                    fieldValue: form,
                    source: "openfda_search",
                    sourceId: med.applicationNumber || null,
                    confidence: 0.8 // FDA data is higher confidence 
                });
            }

            if (med.route && med.route !== "UNKNOWN") {
                observationData.push({
                    medicineId: existingGeneric ? existingGeneric.id : null,
                    genericName: normalizedName,
                    fieldName: "route",
                    fieldValue: masterMedicineNormalizer.normalizeRoute(med.route),
                    source: "openfda_search",
                    sourceId: med.applicationNumber || null,
                    confidence: 0.8
                });
            }

            if (observationData.length > 0) {
                await prisma.medicineObservation.createMany({
                    data: observationData
                });
            }

            // If it already existed natively, safely backfill missing Admin fields manually
            if (existingGeneric) {
                const updateData: any = {};
                if (!existingGeneric.sponsorName && med.manufacturer) {
                    updateData.sponsorName = med.manufacturer;
                }
                if (!existingGeneric.applNo && med.applicationNumber) {
                    updateData.applNo = med.applicationNumber;
                }
                if (existingGeneric.fdaApproved === false && med.applicationNumber) {
                    updateData.fdaApproved = true;
                }

                if (Object.keys(updateData).length > 0) {
                    await prisma.masterMedicine.update({
                        where: { id: Number(existingGeneric.id) },
                        data: updateData,
                    });
                }
            }
        }
    } catch (error) {
        console.error("[Brain] learnFromFda error:", error);
    }
};

const getById = async (id: string) => {
    // If id starts with BRAIN-, strip it
    const cleanId = id.startsWith("BRAIN-") ? id.replace("BRAIN-", "") : id;

    const record = await prisma.masterMedicine.findUnique({
        where: { id: Number(cleanId) },
    });

    if (!record) return null;

    // Format like a single FDA record (the search returns an array, this is for one)
    const formatted = formatAsFdaResponse([record]);
    return formatted.medicines[0];
};

const getDoseRules = async (brand: string, generic: string, forms: string[], route?: string) => {
    const q = (generic || brand).toLowerCase().trim();
    if (!q) return [];

    const record = await prisma.masterMedicine.findFirst({
        where: {
            OR: [
                { genericNameLower: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
            ],
        },
    });

    if (!record || !Array.isArray(record.dosingRules)) return [];

    const normalizedRoutes = Array.isArray(record.route) ? record.route : record.route ? [record.route] : [];

    return (record.dosingRules as any[]).map((rule: any) => ({
        species: rule.species || "All Species",
        minDoseMgPerKg: rule.minDoseMgPerKg || 0,
        maxDoseMgPerKg: rule.maxDoseMgPerKg || 0,
        doseUnit: rule.doseUnit || "mg/kg",
        frequency: rule.frequency || "PRN",
        route: rule.route || normalizedRoutes[0] || "",
        instructions: rule.instructions || record.generalUsageInstructions || "",
        doseSource: "BRAIN",
        doseWarning: null,
    }));
};

// ─── Export ──────────────────────────────────────────────────────

export const masterMedicineService = {
    search,
    getById,
    getDoseRules,
    mergeWithFda,
    learnFromInventory,
    learnFromFda,
    normalizeGenericName,
    isRecordComplete,
};
