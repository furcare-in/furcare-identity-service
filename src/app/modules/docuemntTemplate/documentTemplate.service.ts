// @ts-nocheck
import pkg from "@prisma/client";
const { DocumentTemplate, Prisma } = pkg;
import prisma from "../../../utils/prisma.js";
import calculatePagination, {
  PaginationOptions,
} from "../../../utils/pagination.js";

export const translateToHindi = async (text: string) => {
  const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY; // Replace with your API key
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "hi",
        format: "text",
      }),
    });
    const data = await response.json();
    const convertedString = data.data.translations[0].translatedText || ""
    return convertedString;
  } catch (error) {
    console.error("Translation API error:", error);
    return "";
  }
};

const createDocumentTemplate = async (data: DocumentTemplate) => {
  return prisma.documentTemplate.create({ data });
};

const getDocumentTemplateById = async (id: string) => {
  return prisma.documentTemplate.findUnique({ where: { id: Number(id) } });
};

const getPaginatedDocumentTemplates = async (
  filters: { search?: string } & Partial<DocumentTemplate>,
  options: PaginationOptions,
) => {
  const {
    limit: take,
    skip,
    page,
    sortBy,
    sortOrder,
  } = calculatePagination(options);
  const { search, ...filterData } = filters;

  const conditions: Prisma.DocumentTemplateWhereInput[] = [];

  // partial match
  if (search) {
    conditions.push({
      OR: ["name"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });
  }
  // exact match
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as keyof typeof filterData],
        },
      })),
    });
  }

  const whereConditions = conditions.length ? { AND: conditions } : {};

  const [result, total] = await Promise.all([
    await prisma.documentTemplate.findMany({
      where: whereConditions,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    await prisma.documentTemplate.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit: take },
    data: result,
  };
};

const updateDocumentTemplate = async (
  id: string,
  data: Partial<DocumentTemplate>,
) => {
  return prisma.documentTemplate.update({ where: { id: Number(id) }, data });
};

const deleteDocumentTemplate = async (id: string) => {
  return prisma.documentTemplate.delete({ where: { id: Number(id) } });
};

const documentTemplateService = {
  createDocumentTemplate,
  getDocumentTemplateById,
  getPaginatedDocumentTemplates,
  updateDocumentTemplate,
  deleteDocumentTemplate,
};
export default documentTemplateService;
