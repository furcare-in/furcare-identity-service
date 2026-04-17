// @ts-nocheck
import prisma from "../../../utils/prisma.js";

const upsertOrthopedicExam = async (data: any) => {
  const { visitId, createdAt, updatedAt, ...rest } = data;
  
  // Find if it exists
  const existing = await prisma.orthopedicExam.findFirst({
    where: { visitId: Number(visitId) },
  });

  if (existing) {
    return prisma.orthopedicExam.update({
      where: { id: Number(existing.id) },
      data: rest,
    });
  }

  return prisma.orthopedicExam.create({
    data: { ...rest, visitId },
  });
};

const getOrthopedicExamByVisitId = async (visitId: string) => {
  return prisma.orthopedicExam.findFirst({
    where: { visitId: Number(visitId) },
  });
};

export const OrthopedicExamService = {
  upsertOrthopedicExam,
  getOrthopedicExamByVisitId,
};
