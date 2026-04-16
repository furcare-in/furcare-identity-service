import { Product, Prisma } from "@prisma/client";
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
    PaginationOptions,
} from "../../../utils/pagination.js";

const createProduct = async (data: any) => {
    return prisma.product.create({
        data,
        include: {
            supplier: true,
        }
    });
};

const getProductById = async (id: string) => {
    return prisma.product.findUnique({
        where: { id },
        include: {
            supplier: true,
            businessBranch: true,
        }
    });
};

const getAllProducts = async (
    filters: { search?: string, businessBranchId?: string } & any,
    options: PaginationOptions,
) => {
    const { limit, skip, page, sortBy, sortOrder } = calculatePagination(options);
    const { search, businessBranchId, ...filterData } = filters;

    const conditions: Prisma.ProductWhereInput[] = [{ active: true }];

    // Filter by businessBranchId if provided
    if (businessBranchId) {
        conditions.push({ businessBranchId });
    }

    if (search) {
        conditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { serialNumber: { contains: search, mode: "insensitive" } },
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        conditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions = conditions.length ? { AND: conditions } : {};

    const [result, total] = await Promise.all([
        prisma.product.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                supplier: true,
            }
        }),
        prisma.product.count({ where: whereConditions }),
    ]);

    return {
        meta: { page, limit, total },
        data: result,
    };
};

const updateProduct = async (id: string, data: any) => {
    return prisma.product.update({
        where: { id },
        data,
        include: {
            supplier: true
        }
    });
};

const deleteProduct = async (id: string) => {
    return prisma.product.delete({ where: { id } });
};

const calculateDosage = async (id: string, payload: any) => {
    const { species, weightKg, form, route } = payload;

    // Validate that id is a valid 24-character hex string (MongoDB ObjectID)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error("Invalid product ID. Dosage calculation is only available for products in the inventory.");
    }

    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) {
        throw new Error("Product not found");
    }

    const dosings = (product.dosings as any[]) || [];

    // 1. Filter by species (Case-insensitive)
    let matchingRules = dosings.filter(d =>
        d.species?.toLowerCase() === species?.toLowerCase()
    );

    if (matchingRules.length === 0) {
        throw new Error(`No dosing rules found for species: ${species}`);
    }

    // 2. Further filter by form and route if provided
    let specificRules = matchingRules;
    if (form) {
        specificRules = specificRules.filter(r => r.form?.toLowerCase() === form?.toLowerCase());
    }
    if (route) {
        specificRules = specificRules.filter(r => r.route?.toLowerCase() === route?.toLowerCase());
    }

    // 3. Fallback to species-only rules if specific ones not found
    const rule = specificRules.length > 0 ? specificRules[0] : matchingRules[0];

    const minDoseMg = parseFloat(rule.minDoseMgPerKg);
    const maxDoseMg = parseFloat(rule.maxDoseMgPerKg);

    const minDoseTotal = minDoseMg * weightKg;
    const maxDoseTotal = maxDoseMg * weightKg;

    const result: any = {
        minDoseMg,
        maxDoseMg,
        minDoseTotal,
        maxDoseTotal,
        frequency: rule.frequency,
        form: rule.form,
        route: rule.route,
        instructions: rule.instructions
    };

    // 4. Calculate actionable recommendation if product has strength info
    if (product.strength && product.strength > 0 && product.dispensableUnit) {
        const minQty = minDoseTotal / product.strength;
        const maxQty = maxDoseTotal / product.strength;

        result.actionableRecommendation = {
            minQty: Number(minQty.toFixed(2)),
            maxQty: Number(maxQty.toFixed(2)),
            displayAmount: `${minQty.toFixed(2)} - ${maxQty.toFixed(2)} ${product.dispensableUnit}`,
            dispensableUnit: product.dispensableUnit
        };
    }

    return result;
};

export const productService = {
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
    calculateDosage,
};
