import ApiError from "../errors/ApiError.js";
import httpStatus from "http-status";

/**
 * Parses a route param or body value as a required numeric ID.
 * Throws HTTP 400 if the value is null, undefined, empty, or non-numeric.
 */
export const parseId = (value: string | number | null | undefined): number => {
    if (value === null || value === undefined || value === "") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID: must be a non-empty numeric value");
    }
    const parsed = parseInt(String(value), 10);
    if (isNaN(parsed) || parsed <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ID: "${value}" is not a valid numeric ID`);
    }
    return parsed;
};

/**
 * Parses an optional route param or body value as a numeric ID.
 * Returns undefined if value is null, undefined, or empty string.
 * Throws HTTP 400 if the value is non-numeric but present.
 */
export const parseOptionalId = (
    value: string | number | null | undefined,
): number | undefined => {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = parseInt(String(value), 10);
    if (isNaN(parsed) || parsed <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid ID: "${value}" is not a valid numeric ID`);
    }
    return parsed;
};
