// @ts-nocheck
import { SALT_SUFFIXES } from "../external-api/veterinary.constants.js";

/**
 * Standardizes medicine forms against variations
 */
const normalizeForm = (form: string | null | undefined): string => {
    if (!form) return "UNKNOWN";
    let f = form.toLowerCase().trim();

    // Mapping common variants to canonical forms
    if (f.includes("chew") && f.includes("tab")) return "Chewable Tablet";
    if (f === "tab" || f === "tablets") return "Tablet";
    if (f === "cap" || f === "capsules") return "Capsule";
    if (f.includes("inj")) return "Injection";
    if (f.includes("sol") && f.includes("oral")) return "Oral Solution";
    if (f === "sol" || f === "solution") return "Solution";
    if (f.includes("susp") && f.includes("oral")) return "Oral Suspension";
    if (f === "susp" || f === "suspension") return "Suspension";
    if (f.includes("syr")) return "Syrup";
    if (f.includes("cream")) return "Cream";
    if (f.includes("oint")) return "Ointment";
    if (f.includes("drop") && (f.includes("ear") || f.includes("otic"))) return "Otic Drops";
    if (f.includes("drop") && (f.includes("eye") || f.includes("ophth"))) return "Ophthalmic Drops";
    if (f.includes("paste")) return "Paste";
    if (f.includes("gel")) return "Gel";

    // Capitalize each word for the unmapped canonical string
    return f.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

/**
 * Standardizes routes of administration
 */
const normalizeRoute = (route: string | null | undefined): string => {
    if (!route) return "UNKNOWN";
    let r = route.toLowerCase().trim();

    if (r.includes("oral") || r === "po" || r === "per os") return "PO";
    if (r.includes("intravenous") || r === "iv") return "IV";
    if (r.includes("intramuscular") || r === "im") return "IM";
    if (r.includes("subcutaneous") || r === "sc" || r === "sq") return "SC";
    if (r.includes("topical")) return "TOPICAL";
    if (r.includes("ophthalmic") || r.includes("eye")) return "OPHTHALMIC";
    if (r.includes("otic") || r.includes("ear")) return "OTIC";
    
    return route.toUpperCase().trim();
};

/**
 * Strip salt suffixes to normalize generic names
 * "amoxicillin trihydrate" → "amoxicillin"
 */
const normalizeGenericName = (name: string | null | undefined): string => {
    if (!name) return "UNKNOWN";
    let normalized = name.toUpperCase().trim();
    for (const suffix of SALT_SUFFIXES) {
        const pattern = new RegExp(`\\s+${suffix}$`, "i");
        normalized = normalized.replace(pattern, "");
    }
    // Return Pascal case or Title case for consistency
    return normalized.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
};

/**
 * Standardize Strength (e.g. 250, 250mg, 250 mg)
 */
const normalizeStrength = (strength: string | number | null | undefined): string => {
    if (strength === null || strength === undefined || strength === "") return "UNKNOWN";
    return String(strength).toLowerCase().replace(/\s+/g, "").trim(); 
};

/**
 * Generates the Canonical Identity for a Medicine Variant
 * Format: GENERIC_FORM_ROUTE_STRENGTH (all uppercase, underscores)
 */
const generateMedicineKey = (
    genericName: string | null | undefined,
    form: string | null | undefined,
    route: string | null | undefined,
    strength: string | null | undefined
): string => {
    const cleanGeneric = normalizeGenericName(genericName).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanForm = normalizeForm(form).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanRoute = normalizeRoute(route).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanStrength = normalizeStrength(strength).toUpperCase().replace(/[^A-Z0-9]/g, "");

    return `${cleanGeneric}_${cleanForm}_${cleanRoute}_${cleanStrength}`;
};

export const masterMedicineNormalizer = {
    normalizeForm,
    normalizeRoute,
    normalizeGenericName,
    normalizeStrength,
    generateMedicineKey
};
