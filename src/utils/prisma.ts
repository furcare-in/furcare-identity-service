import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient({ errorFormat: "minimal" });

export default prisma;
