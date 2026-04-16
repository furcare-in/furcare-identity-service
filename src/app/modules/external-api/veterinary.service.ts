// external-api/veterinary.service.ts
// 
// DEPRECATED: VET_CLINICAL_KB hardcoded rules are no longer used.
// Dose rules now come exclusively from the FDA API (NLP extraction in openfda.service.ts).
// 
// This file is kept for backward compatibility — existing callers won't break.
// The utility functions (normalizeGenericName, extractGenericComponents) remain useful.

import {
    SALT_SUFFIXES
} from './veterinary.constants.js';

/**
 * Normalize generic name for matching
 * - Uppercase
 * - Trim
 * - Collapse spaces
 * - Remove salt suffixes
 * 
 * NOTE: Still useful for name normalization in search/matching.
 */
export const normalizeGenericName = (name: string): string => {
    if (!name) return '';

    let normalized = name
        .toUpperCase()
        .trim();

    // Remove descriptions like "(AS SODIUM SALT)" or "AS SODIUM"
    normalized = normalized.replace(/\(.*\)/g, ' ');
    normalized = normalized.replace(/\bAS\b/g, ' ');

    normalized = normalized.replace(/\s+/g, ' ');  // Collapse multiple spaces

    // Remove each salt suffix (word boundary aware)
    SALT_SUFFIXES.forEach((salt: string) => {
        const regex = new RegExp(`\\b${salt}\\b`, 'gi');
        normalized = normalized.replace(regex, '');
    });

    // Clean up any remaining artifacts
    normalized = normalized
        .replace(/[;,\/]/g, ' ')  // Replace separators with space
        .replace(/\s+/g, ' ')      // Collapse spaces again
        .trim();

    return normalized;
};

/**
 * Extract individual components from combination drug names
 * e.g., "AMOXICILLIN;CLAVULANATE" → ["AMOXICILLIN", "CLAVULANATE"]
 * 
 * NOTE: Still useful for combination drug parsing.
 */
export const extractGenericComponents = (name: string): string[] => {
    if (!name) return [];

    // Split by common separators
    const components = name
        .split(/[;,\/]/)           // Split by ; , or /
        .map(c => normalizeGenericName(c))  // Normalize each
        .filter(c => c.length > 0);          // Remove empty

    return components;
};

/**
 * DEPRECATED: No longer looks up hardcoded VET_CLINICAL_KB.
 * Returns empty array. Dose rules come from FDA API only.
 */
export const findClinicalRules = (_genericName: string): any[] => {
    return [];
};

/**
 * DEPRECATED: Always returns false.
 * No more hardcoded clinical reference lookups.
 */
export const hasClinicalReference = (_genericName: string): boolean => {
    return false;
};

/**
 * Service export
 */
export const veterinaryService = {
    normalizeGenericName,
    extractGenericComponents,
    findClinicalRules,
    hasClinicalReference
};
